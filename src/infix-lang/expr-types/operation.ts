import {Expr, ETypes, toJs} from "./expr";


export interface FOperators extends Expr {
  expr1: Expr;
  operations: Array<{
    operator: string;
    expr: Expr;
  }>
}

export function mkOperator(res): FOperators {
  const operations = res[1].map(op => {
    return {
      operator: op[0],
      expr: op[1]
    };
  });

  return {
    type: ETypes.Operators,
    expr1: res[0],
    operations: operations
  };
}

export function operatorsToJs(operators: FOperators) {
  return `${toJs(operators.expr1)} ${operators.operations.map(op => {
    return `${op.operator} ${toJs(op.expr)}`;
  }).join(' ')}`;
}