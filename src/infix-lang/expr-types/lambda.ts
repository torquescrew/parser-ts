import {Expr, ETypes, toJs, returnLastExprInBlock} from "./expr";


export interface Lambda extends Expr {
  arguments: string[];
  block: Expr[];
}

export function mkLambda(res): Lambda {
  // console.log(res);

  return {
    type: ETypes.Lambda,
    arguments: res[0],
    block: res[2]
  };
}

export function lambdaToJs(lambda: Lambda): string {
  const args = lambda.arguments.map(toJs).join(', ');
  const block = returnLastExprInBlock(lambda.block.map(toJs));

  return `function (${args}) {\n ${block.join('\n')} \n }`;
}