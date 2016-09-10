import {IInputData, Input} from "../input";


export type NoResult = null;
export const noResult: NoResult = null;

export type ParserResult = any;

export type SuccessFunc = (result: ParserResult) => any;
export type FailFunc = (input: IInputData, ...extra: any[]) => any;

export interface RawParser {
  apply: (input: Input) => any;
  map: (success: SuccessFunc) => IParser;
  fail: (fail: FailFunc) => IParser;
}

export type WrappedParser = (() => RawParser);

export type IParser2 = RawParser | WrappedParser;

export type IParser = RawParser;

export function mkParser(applyFunc: (input: Input, success: SuccessFunc, failure: FailFunc) => any): IParser {
  let mapFunc: SuccessFunc;
  let failFunc: FailFunc;

  let handleFail = (input, ...args) => {
    if (failFunc) {
      return failFunc(input, args);
    }
    else {
      return noResult;
    }
  };

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
      return applyFunc(input, handleResult, handleFail);
    },
    map: (f: SuccessFunc) => {
      mapFunc = f;

      return self;
    },
    fail: (f: FailFunc) => {
      failFunc = f;

      return self;
    }
  };

  return self;
}