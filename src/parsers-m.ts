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

export function char3(c: string) {
  return (input: Input) => {

    let self = {
      then: (f: Function) => {
        let r = input.nextChar();

        if (r === c) {
          input.advance();
          f(c);
        }
        else {
          f(noResult);
        }
        return self
      }
    };

    return self;
  }
}

interface IParser {
  apply: (Input) => any;
  map: (Function) => IParser;
}

export function char5(c: string): IParser {
  let mapFunc: Function;

  let self = {
    apply: (input: Input) => {
      let r = input.nextChar();

      let result: any | null = noResult;

      if (r === c) {
        input.advance();
        result = c;
      }

      if (mapFunc) {
        return mapFunc(result);
      }
      else {
        return result;
      }
    },

    map: (f: Function) => {
      mapFunc = f;

      return self;
    },
  };

  return self;
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

function char7(c: string): IParser {
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


abstract class CParser {
  mapFunc: Function;

  abstract apply(input: Input): CParser;

  map(f: Function): CParser {
    this.mapFunc = f;

    return this;
  }

  getResult(result) {
    if (this.mapFunc) {
      return this.mapFunc(result);
    }
    else {
      return result;
    }
  }
}

class Char extends CParser {
  c: string;

  constructor(c) {
    super();
    this.c = c;
  }

  apply(input: Input): CParser {
    let r = input.nextChar();

    let result: any | null = noResult;

    if (r === this.c) {
      input.advance();
      result = this.c;
    }

    return this.getResult(result);
  }
}


export function char2(c: string) {
  return (input: Input) => new Promise((resolve, reject) => {
    let r = input.nextChar();

    if (r === c) {
      input.advance();
      resolve(c);
    }
    resolve(undefined);
  })
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
  const c = char7('c').map(r => console.log(r));
  const input = new Input('c');


  const result = applyParser2(c, input);

  console.log('result: ', result);
}
testPromises();


export function applyParser2(parser, input) {
  return parser.apply(input);
}

export function applyParser(parser: LeParser, input: Input): LeParser {
  return parser.apply(input);
}