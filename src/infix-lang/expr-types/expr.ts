import {DefVar} from "./def-var";
import {FunCall} from "./fun-call";
import {DefFun} from "./def-fun";


export const ETypes = {
  VariableDefinition: 'VariableDefinition',
  FunctionDefinition: 'FunctionDefinition',
  FunctionCall: 'FunctionCall',
  Boolean: 'Boolean',
  Number: 'Number',
  String: 'String'
};

export interface Expr {
  type: string;
}

export function toJs(expr: Expr) {
  switch (expr.type) {
    case ETypes.VariableDefinition:
      const defVar = expr as DefVar;
      return `var ${defVar.identifier} = ${toJs(defVar.value)}`;
    case ETypes.FunctionCall:
      const funCall = expr as FunCall;
      return `${funCall.functionName}(${funCall.arguments.map(toJs).join(', ')})`;
    case ETypes.FunctionDefinition:
      const defFun = expr as DefFun;
      const args = defFun.arguments.join(', ');
      const block = defFun.block.map(toJs).join('\n');
      return `function ${defFun.identifier} (${args}) {\n ${block} \n }`;
    default:
      console.log(expr);
      return expr.toString();
  }
}

export function traverseTree(expr: any, f: (expr: Expr) => any) {
  // if (expr.isArray()) {
  //
  // }

  switch (expr.type) {
    case ETypes.VariableDefinition:
      const variableDefinition = expr as DefVar;
      // traverseTree(variableDefinition.)
  }
}

// function isExpr(e: Expr): boolean {
//   return e.type && ETypes[e.type] === e.type;
// }

export interface FBool extends Expr {
  value: boolean;
}

export function mkBool(res): FBool {
  return {
    type: ETypes.Boolean,
    value: res === 'true'
  };
}

export interface FNumber extends Expr {
  value: number;
}

export function mkNumber(res): FNumber {
  return {
    type: ETypes.Number,
    value: +res
  };
}

export interface FString extends Expr {
  value: string;
}

export function mkString(res): FString {
  return {
    type: ETypes.String,
    value: res
  };
}