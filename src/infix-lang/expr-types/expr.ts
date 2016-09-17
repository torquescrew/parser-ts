import {DefVar} from "./variable-definition";
import {FunCall} from "./function-call";
import {DefFun} from "./function-definition";


export const ETypes = {
  VariableDefinition: 'VariableDefinition',
  FunctionDefinition: 'FunctionDefinition',
  FunctionCall: 'FunctionCall',
  Boolean: 'Boolean',
  Number: 'Number',
  String: 'String',
  Identifier: 'Identifier'
};

export interface Expr {
  type: string;
}

export function toJs(expr: any) {
  if (expr instanceof Array) {
    return expr.map(toJs).join('\n');
  }

  switch (expr.type) {
    case ETypes.VariableDefinition:
      const defVar = expr as DefVar;
      return `var ${toJs(defVar.identifier)} = ${toJs(defVar.value)}\n`;
    case ETypes.FunctionCall:
      const funCall = expr as FunCall;
      return `${toJs(funCall.functionName)}(${funCall.arguments.map(toJs).join(', ')})`;
    case ETypes.FunctionDefinition:
      const defFun = expr as DefFun;
      const args = defFun.arguments.map(toJs).join(', ');
      const block = defFun.block.map(toJs).join('\n');
      return `function ${toJs(defFun.identifier)} (${args}) {\n ${block} \n }`;
    case ETypes.Boolean:
      const bool = expr as FBool;
      return bool.value.toString();
    case ETypes.Number:
      const fNum = expr as FNumber;
      return fNum.value.toString();
    case ETypes.String:
      const fString = expr as FString;
      return fString.value.toString();
    case ETypes.Identifier:
      const fIdent = expr as FIdentifier;
      return fIdent.value.toString();
    default:
      console.log('no type: ', expr);
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

export interface FIdentifier extends Expr {
  value: string;
}

export function mkIdentifier(res): FIdentifier {
  return {
    type: ETypes.Identifier,
    value: res[0]
  }
}