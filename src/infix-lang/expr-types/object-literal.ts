import {Expr, FIdentifier, ETypes, toJs} from "./expr";


export interface KeyValuePair {
  identifier: FIdentifier;
  expr: Expr;
}

function keyValuePairToJs(pair: KeyValuePair): string {
  return `${toJs(pair.identifier)}: ${toJs(pair.expr)}`;
}

export interface ObjectLiteral extends Expr {
  pairs: KeyValuePair[];
}

export function mkObjectLiteral(res) {
  const pairsOb = res[1] as Array<Array<any>>;
  let pairs: KeyValuePair[] = [];

  pairsOb.forEach((pair) => {
    pairs.push({
      identifier: pair[0],
      expr: pair[2]
    });
  });

  return {
    type: ETypes.ObjectLiteral,
    pairs: pairs
  };
}

export function objectLiteralToJs(obj: ObjectLiteral): string {

  const strs = obj.pairs.map((pair) => {
    return keyValuePairToJs(pair);
  });

  return `{ ${strs.join(', ')} }`;
}