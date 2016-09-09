import {Input} from './input';
import * as util from './util';


export type NoResult = null;
export const noResult: NoResult = null;

export const __: IParser = optionalWhiteSpace();

export const number: IParser = regex(/-?(\d+(\.\d+)?)/);

export const stringLiteral: IParser = regex(/"([^"\\]|\\.)*"/);

export const ident: IParser = regex(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/);


type MapFunc = (any) => any;

interface IParser {
  apply: (Input) => any;
  map: (Function) => IParser;
}

function mkParser(applyFunc: (Input, Function) => any): IParser {
  let mapFunc: MapFunc;

  let handleResult = (result: any) => {
    if (mapFunc) {
      return mapFunc(result);
    }
    else {
      return result;
    }
  };

  let self: IParser = {
    apply: (input: Input) => {
      return applyFunc(input, handleResult);
    },
    map: (f: MapFunc) => {
      mapFunc = f;

      return self;
    },
  };

  return self;
}

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

export function optionalWhiteSpace() {
  return mkParser((input: Input, handleResult) => {
    while (input.nextChar() === '') {
      input.advance();
    }

    return handleResult('');
  });
}

export function regex(re: RegExp) {
  return mkParser((input: Input, handleResult: MapFunc) => {
    const code = input.rest();
    const match = re.exec(code);

    if (match !== null && match.index === 0) {
      const result = match[0];
      input.advanceBy(result.length);
      return handleResult(result);
    }
    else {
      return noResult;
    }
  });
}

export function and(p1: IParser, p2: IParser) {
  return mkParser((input: Input, handleResult) => {
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
    return handleResult([r1, r2].filter(r => r !== ''));
  });
}

export function or(...args: Array<IParser | string>) {
  const parsers: IParser[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  });

  return mkParser((input: Input, handleResult) => {
    for (let i = 0; i < parsers.length; i++) {
      const result = applyParser(parsers[i], input);

      if (result !== noResult) {
        return handleResult(result);
      }
    }
    return noResult;
  });
}


// Array returned doesn't contain '' values.
// Auto converts plain strings to word parsers.
export function seq(...args: Array<IParser | string>) {
  const parsers: IParser[] = args.map((arg) => {
    return util.isString(arg) ? word(arg as string) as IParser : arg as IParser;
  });

  return mkParser((input: Input, handleResult) => {
    const pos = input.getPosition();
    let results: any[] = [];

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
    return handleResult(results);
  });
}

function test() {

  parseAndPrint(and(char('b'), char('c').map(c => c)).map((r: string[]) => {return r.join('')}), 'bc');
  parseAndPrint(word('charles').map(r => 'yay!'), 'charles');
  parseAndPrint(seq('ch', 'ar', 'les'), 'charles');
  parseAndPrint(seq('ch', 'ar', 'les').map(r => r.join('')), 'charles');

}
test();

export function parseAndPrint(parser: IParser, text: string) {
  let input = new Input(text);
  let result = applyParser(parser, input);
  console.log(result);
}

export function applyParser(parser: IParser, input: Input) {
  return parser.apply(input);
}
