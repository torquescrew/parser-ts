import {Input} from './input';
import * as util from './util';

// export type ParserResult = string | null | Array<string | null>;

// export type Parser = (Input) => Parser | ParserResult;

export type Parser<Result> = (Input) => Result

export type NoResult = null;
export const noResult: NoResult = null;


const a: RegExp = /-?(\d+(\.\d+)?)/;

export const __ = optionalWhiteSpace();

export const number = regex(/-?(\d+(\.\d+)?)/);

export const stringLiteral = regex(/"([^"\\]|\\.)*"/);

export const ident = regex(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/);


export function char(c: string): Parser<string | NoResult> {
  return (input: Input) => {
    var r = input.nextChar();

    if (r === c) {
      input.advance();
      return c;
    }
    else {
      return noResult;
    }
  };
}

export function word(str: string): Parser<string | NoResult> {
  return (input: Input) => {
    const charList = str.split('');
    const pos = input.getPosition();

    for (let i = 0; i < charList.length; i++) {
      if (input.nextChar() === charList[i]) {
        input.advance();
      }
      else {
        input.setPosition(pos);
        return noResult;
      }
    }
    return str;
  };
}


// Always succeeds.
export function optionalWhiteSpace(): Parser<string> {
  return (input: Input) => {

    while (input.nextChar() === ' ') {
      input.advance();
    }
    return '';
  };
}

export function regex(re: RegExp): Parser<string | NoResult> {
  return (input: Input) => {
    const code = input.rest();
    const match = re.exec(code);

    if (match !== null && match.index === 0) {
      const result = match[0];
      input.advanceBy(result.length);
      return result;
    }
    else {
      return noResult;
    }
  };
}

export function or(...args: Parser<any>[]): Parser<any> {
  //TODO: Auto convert strings to word parsers.
  let parsers: Parser<any>[] = [];

  for (let i = 0; i < arguments.length; i++) {
    parsers[i] = arguments[i];
  }

  return (input: Input) => {
    for (let i = 0; i < parsers.length; i++) {
      const result = applyParser(parsers[i], input);

      if (result !== noResult) {
        return result;
      }
    }
    return noResult;
  };
}

export function and(parser0: Parser<any>, parser1: Parser<any>): Parser<[string] | null> {
  return (input: Input) => {
    const pos = input.getPosition();

    const result0 = applyParser(parser0, input);
    if (result0 === null) {
      input.setPosition(pos);
      return null;
    }

    const result1 = applyParser(parser1, input);
    if (result1 === null) {
      input.setPosition(pos);
      return null;
    }
    return [result0, result1];
  };
}

// Array returned doesn't contain '' values.
// Auto converts plain strings to word parsers.
export function seq(...args: any[]) {
  var parsers: Parser<any>[] = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];

    if (util.isString(arg)) {
      parsers[i] = word(arg);
    }
    else {
      parsers[i] = arg;
    }
  }

  return (function (input) {
    var pos = input.getPosition();
    var results: Parser<any>[] = [];

    for (var i = 0; i < parsers.length; i++) {
      var result = applyParser(parsers[i], input);
      if (result === null) {
        input.setPosition(pos);
        return null;
      }
      else if (result !== '') {
        results.push(result);
      }
    }
    return results;
  });
}

export function many(parser) {
  return (function (input) {
    var results: Parser<any>[] = [];

    var result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);
      result = applyParser(parser, input);
    }
    return results;
  });
}

export function many1(parser) {
  return (function (input) {
    var results = applyParser(many(parser), input);
    if (results.length > 0) {
      return results;
    }
    return null;
  });
}

export function repSep(parser, separator) {
  return (function (input) {
    var results: Parser<any>[] = [];
    var sepParser = seq(__, word(separator), __);

    var result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);

      var sepRes = applyParser(sepParser, input);
      if (sepRes !== null) {
        result = applyParser(parser, input);
      }
      else {
        result = null;
      }
    }
    if (results.length === 0)
      return null;

    return results;
  });
}


export function applyParser(parser, input: Input) {
  if (parser.length === 0) {
    return parser()(input);
  }
  else {
    return parser(input);
  }
}

// Doesn't advance position
export function not(parser) {
  return (function (input) {
    //input.savePosition();
    var pos = input.getPosition();

    var result = applyParser(parser, input);
    if (result !== null) {
      //input.restorePosition();
      input.setPosition(pos);
      return null;
    }
    //input.setPosition(pos);
    return '';
  });
}

export function apply(parser, f) {
  return (function (input) {
    var result = applyParser(parser, input);

    if (result == null) {
      return null;
    }
    else {
      return f(result);
    }
  });
}

export function parseAll(parserIn, input) {
  var inputObj = new Input(input);

  var res = applyParser(parserIn, inputObj);

  if (res === null) {
    console.log('null!!!!!');
  }
  return res;
}

export function parseAndPrint(parserIn, input) {
  var inputObj = new Input(input);
  var result = applyParser(parserIn, inputObj);
  console.log(result);
}

export function logParser(parser, print) {
  return (function (input) {
    if (print !== false) {
      console.log(input.rest());
    }
    return applyParser(parser, input);
  });
}


function tests() {
  var parser = or(and(char('a'), char('b')), and(char('c'), char('d')));

  var stuff = and(word('hey'), __);

  var abbba = regex(/ab+c/);

  var multi = seq(word('def'), __, word('hi'));

  var theMany = many(word('hi'));

  var joined = seq(theMany, multi);

  var regexSeq = seq(word('def'), regex(/a+c/), word('word'));

  console.log(parseAll(parser, 'ab'));
  console.log(parseAll(parser, 'cd'));
  console.log(parseAll(stuff, 'hey '));
  console.log(parseAll(multi, 'def     hi'));
  console.log(parseAll(joined, 'hihihihihidef     hi'));
  console.log(parseAll(abbba, 'abbbcabbc'));
  console.log(parseAll(regexSeq, 'defaaaacword'));
  console.log(parseAll(stringLiteral, '"hello there"'));
  console.log(parseAll(ident, '_fred'));
  console.log(parseAll(number, '-23.871'));
  console.log(parseAll(or(word('hello'), word('hi'), word('bye')), 'hi bye'));
  console.log(parseAll(repSep(word('hi'), ', '), "hi, hi, hi"));
}
tests();
