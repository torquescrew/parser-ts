import {Input, makeInputFromFile} from "../input";
import * as util from "../util";
import {noResult, SuccessFunc, FailFunc, RawParser, WrappedParser, IParser, IParser2, mkParser} from "./types";


export const __: IParser = optionalWhiteSpace();

export const number: IParser = regex(/-?(\d+(\.\d+)?)/);

export const stringLiteral: IParser = regex(/"([^"\\]|\\.)*"/);

export const ident: IParser = regex(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/);


export function char(c: string): IParser {
  return mkParser((input: Input, handleResult) => {
    let r = input.nextChar();

    let result: any | null = noResult;

    if (r === c) {
      input.advance();
      result = c;
    }
    return handleResult(result);
  });
}

export function word(str: string): IParser {
  return mkParser((input: Input, handleResult) => {
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
    return handleResult(str);
  });
}

export function optionalWhiteSpace(): IParser {
  return mkParser((input: Input, handleResult) => {
    while (input.nextChar() === ' ') {
      input.advance();
    }

    return handleResult('');
  });
}

export function regex(re: RegExp): IParser {
  return mkParser((input: Input, success: SuccessFunc) => {
    const code = input.rest();
    const match = re.exec(code);

    if (match !== null && match.index === 0) {
      const result = match[0];
      input.advanceBy(result.length);
      return success(result);
    }
    else {
      return noResult;
    }
  });
}

export function or(...args: Array<IParser2 | string>): IParser {
  const parsers: IParser[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  });

  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    for (let i = 0; i < parsers.length; i++) {
      const result = applyParser(parsers[i], input);

      if (result !== noResult) {
        return success(result);
      }
    }
    fail(input.getInputData());
    return noResult;
  });
}


// Array returned doesn't contain '' values.
// Auto converts plain strings to word parsers.
export function and(...args: Array<IParser2 | string>): IParser {
  const parsers: IParser[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  });

  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    const pos = input.getPosition();
    let results: any[] = [];

    for (let i = 0; i < parsers.length; i++) {
      let result = applyParser(parsers[i], input);

      if (result === noResult) {
        fail(input.getInputData(), {parserIndex: i});

        input.setPosition(pos);
        return noResult;
      }
      else if (result !== '') {
        results.push(result);
      }
    }
    // console.log('and succeeded');
    return success(results);
  });
}

// Doesn't advance position
export function not(parserIn: string | IParser): IParser {
  const parser = (util.isString(parserIn) ? word(parserIn as string) : parserIn) as IParser;

  return mkParser((input: Input, success) => {
    const pos = input.getPosition();
    const result = applyParser(parser, input);

    if (result !== noResult) {
      input.setPosition(pos);

      return noResult;
    }
    return success('');
  });
}

export function many(parser: IParser2): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];

    let result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);
      result = applyParser(parser, input);
    }
    return success(results);
  });
}

export function many1(parser: IParser2): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];

    let result = applyParser(parser, input);
    while (result !== null) {
      results.push(result);
      result = applyParser(parser, input);
    }

    if (results.length > 0) {
      return success(results);
    }
    fail(input.getInputData());
    return noResult;
  });
}

// Always succeeds
export function repSep(parser: IParser2, separator: string): IParser {
  return mkParser((input: Input, success: SuccessFunc, fail: FailFunc) => {
    let results: any[] = [];
    let sepParser = and(__, word(separator), __);

    let result = applyParser(parser, input);
    while (result !== noResult) {
      results.push(result);

      let sepRes = applyParser(sepParser, input);
      if (sepRes !== noResult) {
        result = applyParser(parser, input);
      }
      else {
        result = noResult;
      }
    }
    // if (results.length === 0) {
    //   fail(input.getInputData());
    //   return noResult;
    // }

    return success(results);
  });
}

function test() {

  parseAndPrint(and(char('b'), char('c').map(c => c)).map((r: string[]) => {return r.join('')}), 'bc');
  parseAndPrint(word('charles').map(r => 'yay!'), 'charles');
  parseAndPrint(and('ch', 'ar', 'les'), 'charles');
  parseAndPrint(and('ch', 'ar', 'les').map((r: string[]) => r.join('')), 'charles');
  parseAndPrint(or('hi', 'bye'), 'bye');
  parseAndPrint(not('hi').map(r => r === ''), 'hi');

}
// test();

export function parseAndPrint(parser: IParser, text: string) {
  let input = new Input(text);
  let result = applyParser(parser, input);
  if (result === null) {
    console.log('Compile failed.');
  }
  else {
    console.log(result);
  }
}

export function parse(parser: IParser2, code: string) {
  const input = new Input(code);
  const result = applyParser(parser, input);

  if (result === null) {
    return 'Compile failed.';
  }
  else {
    return result;
  }
}

export function parseAndPrintFile(parser: IParser, fileName: string) {
  const input = makeInputFromFile(fileName);
  if (input !== null) {
    const result = applyParser(parser, input);

    if (result === null) {
      console.log('Compile failed.');
    }
    else {
      console.log(result);
    }
  }
}

export function parseFile(parser: IParser, fileName: string): string {
  const input = makeInputFromFile(fileName);
  if (input !== null) {
    const result = applyParser(parser, input);

    if (result === null) {
      return 'Compile failed.';
    }
    else {
      return result;
    }
  }
  return 'failed to read file';
}

export function applyParser(parser: IParser2, input: Input) {
  if (parser['length'] === 0) {
    const wrappedParser = parser as WrappedParser;
    return wrappedParser().apply(input);
  }
  else {
    const rawParser = parser as RawParser;
    return rawParser.apply(input);
  }
}
