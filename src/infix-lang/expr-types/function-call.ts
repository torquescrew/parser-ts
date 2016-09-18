import {Expr, ETypes, FIdentifier} from "./expr";
import {IInputData} from "../../input";


export interface FunCall extends Expr {
  functionName: FIdentifier;
  arguments: Expr[];
}

export function mkFunctionCall(res): FunCall {
  const name = res[0] as FIdentifier;
  const args = res[1];

  return {
    type: ETypes.FunctionCall,
    functionName: name,
    arguments: args
  };
}

export function functionCallFail(input: IInputData, extra) {
  // if (extra && extra['parserIndex'] > 1) {
  //   console.log('funCall parse error: ', input, extra);
  // }
}

export function mkFunCallInfix(res): FunCall {
  const fIdentifier = res[2] as FIdentifier;
  const args = [res[0]].concat(res[3]);

  return {
    type: ETypes.FunctionCall,
    functionName: fIdentifier,
    arguments: args
  };
}