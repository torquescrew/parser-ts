import {Input} from './input';
import * as util from './util';


export type NoResult = null;
export const noResult: NoResult = null;


interface IParser {
  apply: (Input) => any;
  map: (Function) => IParser;
}

function mkParser(applyFunc: (Input, Function) => any): IParser {
  let mapFunc: (result: any) => any;

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
    map: (f: Function) => {
      mapFunc = f;

      return self;
    },
  };

  return self;
}

function char(c: string): IParser {
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


function test() {
  const c = char('c').map(r => console.log(r));
  const input = new Input('bc');

  const bc = and(char('b'), char('c').map(c => c)).map((r: string[]) => {return r.join('')});

  const result = applyParser(bc, input);

  console.log('result: ', result);
}
test();


export function applyParser(parser, input) {
  return parser.apply(input);
}
