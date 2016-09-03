import {Input} from './input';
import * as util from './util';


export type NoResult = null;
export const noResult: NoResult = null;

class MyParser {
  c: string;
  input: Input;

  constructor(c: string, input: Input) {
    this.c = c;
    this.input = input;
  }

  then(f: Function) {
    let r = this.input.nextChar();

    if (r === this.c) {
      this.input.advance();
      // return this.c;
      f(this.c);
    }
    else {
      f(noResult);
      // return noResult;
    }
  }
}

function char4(c: string) {
  return (input: Input) => {
    return new MyParser(c, input);
  };
}

interface LeParser {
  apply: (Input) => LeParser;
  then: (Function) => LeParser;
}

export function char(c: string): LeParser {
  let result: string | NoResult = noResult;

  let self: LeParser = {
    apply: (input: Input) => {
      let r = input.nextChar();

      if (r === c) {
        input.advance();
        result = c;
      }
      return self;
    },
    then: (f: Function) => {
      f(result);
      return self;
    }
  };

  return self;
}

export function and(p1: LeParser, p2: LeParser) {
  let result: any | NoResult = noResult;

  let self: LeParser = {
    apply: (input: Input) => {
      const pos = input.getPosition();

      applyParser(p1, input).then((r1) => {
        if (r1 === noResult) {
          input.setPosition(pos);
        }
        else {
          applyParser(p2, input).then((r2) => {
            if (r2 === noResult) {
              input.setPosition(pos);
            }
            else {
              result = [r1, r2].filter(r => r !== '');
            }
          });
        }
      });

      return self;
    },
    then: (f: Function) => {
      f(result);
      return self;
    }
  };

  return self;
}

function testPromises() {
  const c = char('c');
  const inp = new Input('cb');

  const p = and(char('c'), char('b')).then((r) => {
    console.log(r);
  });

  applyParser(p, inp).then(r => {
    console.log(r);
  });
}
testPromises();

export function applyParser(parser: LeParser, input: Input): LeParser {
  return parser.apply(input);
}