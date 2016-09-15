import {Expr} from "./expr";


export interface FunCall extends Expr {
  functionName: string;
  arguments: Expr[];
}

export function mkFunCall(res): FunCall {
  const name = res[0];
  const args = res[1];

  return {
    type: 'funCall',
    functionName: name,
    arguments: args
  };
}


export function mkFunCallInfix(res): FunCall {
  const name = res[2];
  const args = [res[0]].concat(res[3]);

  return {
    type: 'funCall',
    functionName: name,
    arguments: args
  };
}