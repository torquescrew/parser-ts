import {Expr, ETypes} from "./expr";
import {IInputData} from "../../input";


export interface DefFun extends Expr {
  identifier: string;
  arguments: string[];
  block: Expr[];
}

export function mkDefFun(res): DefFun {
  return {
    type: ETypes.FunctionDefinition,
    identifier: res[1],
    arguments: res[2],
    block: res[3]
  };
}

export function functionDefinitionFail(input: IInputData, extra) {
  if (extra && extra['parserIndex'] > 1) {
    console.log('defFun parse error: ', input, extra);
  }
}

