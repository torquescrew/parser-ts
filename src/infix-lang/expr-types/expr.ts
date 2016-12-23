import {DefVar} from "./variable-definition";
import {FunCall} from "./function-call";
import {DefFun, functionDefinitionToJs} from "./function-definition";
import {FConditional, conditionalToJs} from "./conditionals";
import {FOperators, operatorsToJs} from "./operation";
import {lambdaToJs, Lambda} from "./lambda";


export const ETypes = {
  Bracketed: 'Bracketed',
  VariableDefinition: 'VariableDefinition',
  FunctionDefinition: 'FunctionDefinition',
  Lambda: 'Lambda',
  FunctionCall: 'FunctionCall',
  List: 'List',
  Boolean: 'Boolean',
  Number: 'Number',
  String: 'String',
  Identifier: 'Identifier',
  Conditional: 'Conditional',
  Operators: 'Operators'
};

export interface Expr {
  type: string;
}

export interface FBracketed extends Expr {
  value: Expr;
}

export function mkBracketed(res): FBracketed {
  return {
    type: ETypes.Bracketed,
    value: res[1]
  };
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
      return functionDefinitionToJs(expr as DefFun);
    case ETypes.Lambda:
      return lambdaToJs(expr as Lambda);
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
    case ETypes.Conditional:
      return conditionalToJs(expr as FConditional);
    case ETypes.Bracketed:
      const fBracketed = expr as FBracketed;
      return `(${toJs(fBracketed.value)})`;
    case ETypes.Operators:
      return operatorsToJs(expr as FOperators);
    default:
      return `toJs for ${expr} not implemented`;
  }
}

export function blockToJs(block: Expr[], returnLastExpr: boolean): string {
  let results: string[] = block.map(toJs);

  if (returnLastExpr && block.length > 0) {
    const i = block.length - 1;

    if (block[i].type === ETypes.VariableDefinition
      || block[i].type === ETypes.FunctionDefinition) {
      results.push('return');
    }
    else {
      results[i] = `return ${results[i]}`;
    }
  }

  return results.join('\n');
}

// TODO
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