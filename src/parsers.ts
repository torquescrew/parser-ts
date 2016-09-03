import {Input} from './input';
import * as util from './util';

// export type ParserResult = string | null | Array<string | null>;

// export type Parser = (Input) => Parser | ParserResult;

export type Parser<Result> = (Input) => Result

export type NoResult = null;
export const noResult: NoResult = null;


export const __: Parser<string> = optionalWhiteSpace();

export const number: Parser<string|NoResult> = regex(/-?(\d+(\.\d+)?)/);

export const stringLiteral: Parser<string|NoResult> = regex(/"([^"\\]|\\.)*"/);

export const ident: Parser<string|NoResult> = regex(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/);



export function char(c: string): Parser<string | NoResult> {
  return (input: Input) => {
    let r = input.nextChar();

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

export function and(p1: Parser<any>, p2: Parser<any>): Parser<string[] | NoResult> {
  return (input: Input) => {
    const pos = input.getPosition();

    const r1 = applyParser(p1, input);
    if (r1 === noResult) {
      input.setPosition(pos);
      
      return noResult;
    }

    const r2 = applyParser(p2, input);
    if (r2 === noResult) {
      input.setPosition(pos);
      
      return noResult;
    }
    return [r1, r2].filter(r => r !== '');
  };
}

// Array returned doesn't contain '' values.
// Auto converts plain strings to word parsers.
export function seq(...args: Array<Parser<any> | string>) {
  const parsers: Parser<any>[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as Parser<any> : arg as Parser<any>;
  });

  return (input: Input) => {
    const pos = input.getPosition();
    let results: Parser<any>[] = [];

    for (let i = 0; i < parsers.length; i++) {
      let result = applyParser(parsers[i], input);

      if (result === noResult) {
        input.setPosition(pos);
        return noResult;
      }
      else if (result !== '') {
        results.push(result);
      }
    }
    return results;
  };
}

export function many(parser) {
  return (function (input) {
    let results: Parser<any>[] = [];

    let result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);
      result = applyParser(parser, input);
    }
    return results;
  });
}

export function many1(parser) {
  return (function (input) {
    let results = applyParser(many(parser), input);
    if (results.length > 0) {
      return results;
    }
    return null;
  });
}

export function repSep(parser: Parser<any>, separator: string) {
  return (input: Input) => {
    let results: Parser<any>[] = [];
    let sepParser = seq(__, word(separator), __);

    let result = applyParser(parser, input);
    while (result !== noResult) {
      results.push(result);

      let sepRes = applyParser(sepParser, input);
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
  };
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
  return (input: Input) => {
    const pos = input.getPosition();
    const result = applyParser(parser, input);

    if (result !== null) {
      input.setPosition(pos);

      return noResult;
    }
    return '';
  };
}

export function apply(parser, f) {
  return (function (input) {
    let result = applyParser(parser, input);

    if (result == null) {
      return null;
    }
    else {
      return f(result);
    }
  });
}

export function parseAll(parserIn, input) {
  let inputObj = new Input(input);

  let res = applyParser(parserIn, inputObj);

  if (res === null) {
    console.log('null!!!!!');
  }
  return res;
}

export function parseAndPrint(parserIn, input) {
  let inputObj = new Input(input);
  let result = applyParser(parserIn, inputObj);
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
  let parser = or(and(char('a'), char('b')), and(char('c'), char('d')));

  let stuff = and(word('hey'), __);

  let abbba = regex(/ab+c/);

  let multi = seq(word('def'), __, word('hi'));

  let theMany = many(word('hi'));

  let joined = seq(theMany, multi);

  let regexSeq = seq(word('def'), regex(/a+c/), word('word'));

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
// tests();
