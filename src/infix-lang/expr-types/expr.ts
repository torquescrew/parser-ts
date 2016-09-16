import {DefVar} from "./def-var";
import {FunCall} from "./fun-call";
import {DefFun} from "./def-fun";


export interface Expr {
  type: string;
}

export function toJs(expr: Expr) {
  switch (expr.type) {
    case 'def-var':
      const defVar = expr as DefVar;
      return `var ${defVar.identifier} = ${toJs(defVar.value)};`;
    case 'funCall':
      const funCall = expr as FunCall;
      return `${funCall.functionName}(${funCall.arguments.map(toJs).join(', ')})`;
    case 'def-fun':
      const defFun = expr as DefFun;
      const args = defFun.arguments.join(', ');
      const block = defFun.block.map(toJs).join('\n');
      return `function ${defFun.identifier} (${args}) {\n ${block} \n }`;
    default:
      return expr.toString();
  }
}