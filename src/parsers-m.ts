import {Input} from './input';
import * as util from './util';


export type NoResult = null;
export const noResult: NoResult = null;


interface IParser {
  apply: (Input) => any;
  map: (Function) => IParser;
}

function mkParser(applyFunc): IParser {
  let mapFunc: Function;

  let handleResult = (result) => {
    if (mapFunc) {
      return mapFunc(result);
    }
    else {
      return result;
    }
  };

  let self = {
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

    const r1 = applyParser2(p1, input);
    if (r1 === noResult) {
      input.setPosition(pos);

      return noResult;
    }

    const r2 = applyParser2(p2, input);
    if (r2 === noResult) {
      input.setPosition(pos);

      return noResult;
    }
    return handleResult([r1, r2].filter(r => r !== ''));
  });
}


function testPromises() {
  const c = char('c').map(r => console.log(r));
  const input = new Input('bc');

  const bc = and(char('b'), char('c').map(c => c)).map((r: string[]) => {return r.join('')});

  const result = applyParser2(bc, input);

  console.log('result: ', result);
}
testPromises();


export function applyParser2(parser, input) {
  return parser.apply(input);
}
