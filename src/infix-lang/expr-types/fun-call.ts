import {Expr} from "./expr";


export interface FunCall extends Expr {
  functionName: string;
  arguments: Expr[];
}

export function mkFunCall(res): FunCall {
  console.log(res);

  return res;
}


export function mkFunCallInfix(res): FunCall {
  console.log(res);

  return res;
}