import {IInputData, Input} from "../input";


export type NoResult = null;
export const noResult: NoResult = null;

export type ParserResult = any;

export type SuccessFunc = (result: ParserResult) => any;
export type FailFunc = (input: IInputData, extra?: Object) => any;

export interface RawParser {
  apply: (input: Input) => any;
  map: (success: SuccessFunc) => IParser;
  fail: (fail: FailFunc) => IParser;
}

export type WrappedParser = (() => RawParser);

export type IParser2 = RawParser | WrappedParser;

export type IParser = RawParser;

export function mkParser(applyFunc: (input: Input, success: SuccessFunc, failure: FailFunc) => any): IParser {
  // let mapFunc: SuccessFunc;
  let successFuncs: SuccessFunc[] = [];
  let failFunc: FailFunc;

  let handleFail = (inputData: IInputData, extra?: Object) => {
    if (failFunc) {
      return failFunc(inputData, extra);
    }
    else {
      return noResult;
    }
  };

  let handleSuccess = (result: any) => {
    // if (successFuncs.length > 0) {
    //   return applySuccessFuncs(successFuncs, result);
    return successFuncs.reduce((partialResult, f) => {
      return f(partialResult);
    }, result);
    // }
    // if (mapFunc) {
    //   return mapFunc(result);
    // }
    // else {
    //   return result;
    // }
  };

  let self: IParser = {
    apply: (input: Input) => {
      return applyFunc(input, handleSuccess, handleFail);
    },
    map: (f: SuccessFunc) => {
      successFuncs.push(f);
      // mapFunc = f;

      return self;
    },
    fail: (f: FailFunc) => {
      failFunc = f;

      return self;
    }
  };

  return self;
}

// function applySuccessFuncs(successFuncs: SuccessFunc[], result: ParserResult) {
//   return successFuncs.reduce((currentResult, f) => {
//     return f(currentResult);
//   }, result);
// }