import {Expr} from "./expr";


export interface DefFun extends Expr {
  identifier: string;
  arguments: string[];
  block: Expr[];
}

export function mkDefFun(res): DefFun {
  return {
    type: 'def-fun',
    identifier: res[1],
    arguments: res[2],
    block: res[3]
  };
}

