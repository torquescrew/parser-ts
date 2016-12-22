import {Expr, ETypes, toJs, blockToJs} from "./expr";


export interface Lambda extends Expr {
  arguments: string[];
  block: Expr[];
}

export function mkLambda(res): Lambda {
  return {
    type: ETypes.Lambda,
    arguments: res[0],
    block: res[2]
  };
}

export function lambdaToJs(lambda: Lambda): string {
  const args = lambda.arguments.map(toJs).join(', ');
  const block = blockToJs(lambda.block, true);

  return `function (${args}) {\n ${block} \n }`;
}