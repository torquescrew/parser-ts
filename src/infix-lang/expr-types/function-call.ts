import {Expr, ETypes, FIdentifier} from "./expr";


export interface FunCall extends Expr {
  functionName: FIdentifier;
  arguments: Expr[];
}

export function mkFunCall(res): FunCall {
  const name = res[0] as FIdentifier;
  const args = res[1];

  return {
    type: ETypes.FunctionCall,
    functionName: name,
    arguments: args
  };
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