import {Expr, ETypes, toJs, blockToJs} from "./expr";


export interface FConditional extends Expr {
  ifCondition: Expr,
  ifBlock: Expr[],
  elseIfConditions: ElseIfConditional[],
  elseBlock: Expr[]
}

interface ElseIfConditional {
  elseIfCondition: Expr,
  elseIfBlock: Expr[]
}

export function mkConditional(res): FConditional {
  const elseIfConditions = mkElseConditional(res[3]);
  const elseBlock = mkElseBlock(res[4]);

  return {
    type: ETypes.Conditional,
    ifCondition: res[1],
    ifBlock: res[2],
    elseIfConditions: elseIfConditions,
    elseBlock: elseBlock
  };
}

function mkElseConditional(res): ElseIfConditional[] {
  return res.map(c => {
    return {
      elseIfCondition: c[1],
      elseIfBlock: c[2]
    };
  });
}

function mkElseBlock(res): Expr[] {
  return res.map(c => c[1])[0];
}

export function conditionalToJs(conditional: FConditional): string {
  let result: string[] = [];

  const ifBlock = blockToJs(conditional.ifBlock, true);

  result.push(
    `if (${toJs(conditional.ifCondition)}) { ${ifBlock} }`
  );

  conditional.elseIfConditions.forEach((c) => {
    const elIfBlock = blockToJs(c.elseIfBlock, true);

    result.push(
      `else if (${toJs(c.elseIfCondition)}) { ${elIfBlock} }`
    );
  });

  if (conditional.elseBlock && conditional.elseBlock.length > 0) {
    result.push(
      `else { ${blockToJs(conditional.elseBlock, true)} }`
    );
  }

  // Conditionals are made to be expressions by wrapping in a function.
  return `(function () { ${result.join('\n')} })()`;
}

