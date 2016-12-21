import {Expr, ETypes, toJs} from "./expr";
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

export function functionDefinitionToJs(defFun: DefFun): string {
  const args = defFun.arguments.map(toJs).join(', ');

  const block = defFun.block.map(toJs);

  if (block.length > 0) {
    const i = block.length - 1;
    block[i] = `return ${block[i]}`;
  }

  return `function ${toJs(defFun.identifier)} (${args}) {\n ${block.join('\n')} \n }`;
}

