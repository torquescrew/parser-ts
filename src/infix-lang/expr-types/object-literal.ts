import {Expr, FIdentifier, ETypes} from "./expr";


export interface keyValuePair {
  identifier: FIdentifier;
  expr: Expr;
}

export interface ObjectLiteral extends Expr {
  keyValues: {[identifier: string]: Expr};
}

export function mkObjectLiteral(res) {
  const pairs = res[1] as Array<Array<any>>;
  let keyValues = {};

  pairs.forEach((pair) => {
    keyValues[pair[0]] = pair[1];
  });

  return {
    type: ETypes.ObjectLiteral,
    keyValues: keyValues
  };
}

export function objectLiteralToJs(obj: ObjectLiteral) {
  
}