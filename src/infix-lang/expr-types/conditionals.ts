import {Expr, ETypes, toJs} from "./expr";


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

export function conditionalToJs(conditional: FConditional) {
  console.log(conditional);

  let result: string[] = [];

  result.push(
    `if (${toJs(conditional.ifCondition)}) { ${conditional.ifBlock.map(toJs).join('')} }`
  );

  conditional.elseIfConditions.forEach((c) => {
    result.push(
      `else if (${toJs(c.elseIfCondition)}) { ${c.elseIfBlock.map(toJs).join('')} }`
    );
  });

  if (conditional.elseBlock.length > 0) {
    result.push(
      `else { ${conditional.elseBlock.map(toJs)} }`
    )
  }

  return result.join('\n');
}

