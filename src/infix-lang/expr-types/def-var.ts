import {IInputData} from "../../input";
import {Expr, ETypes} from "./expr";


export interface DefVar extends Expr {
  identifier: string;
  value: Expr
}

export function defVarFail(inputData: IInputData, extra) {
  const pos = inputData.position;

  if (extra && extra['parserIndex'] > 1) {
    console.log('Error: Expected identifier, found:', inputData.code.slice(pos, pos + 20));
  }
}

export function mkDefVar(res): DefVar {
  const identifier = res[1];
  const value = res[3];

  return {
    type: ETypes.VariableDefinition,
    identifier: identifier,
    value: value
  };
}
