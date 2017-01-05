import {
  char,
  word,
  or,
  and,
  ident,
  not,
  __,
  many,
  many1,
  stringLiteral,
  number,
  repSep,
  repSep2
} from "./parser-lib/parsers-m";
import {defVarFail, mkDefVar} from "./infix-lang/expr-types/variable-definition";
import {mkFunctionCall, mkFunCallInfix, functionCallFail} from "./infix-lang/expr-types/function-call";
import {mkBool, mkNumber, mkString, mkIdentifier, mkBracketed} from "./infix-lang/expr-types/expr";
import {mkDefFun, functionDefinitionFail} from "./infix-lang/expr-types/function-definition";
import {mkConditional} from "./infix-lang/expr-types/conditionals";
import {mkOperator} from "./infix-lang/expr-types/operation";
import {mkLambda} from "./infix-lang/expr-types/lambda";
import {mkList, mkIndexIntoList} from "./infix-lang/expr-types/list";
import * as _ from "underscore";
import {IParser, WrappedParser} from "./parser-lib/types";
import {mkObjectLiteral, mkAccessObjectElement} from "./infix-lang/expr-types/object-literal";


const fTrue = word('true');
const fFalse = word('false');
const fLet = word('let');
const fFun = word('def');
const fEquals = char('=');
const fArrow = word('=>');

const fIf = word('if');
const fElseIf = word('else if');
const fElse = word('else');

const fNull = word('null');

const operator = or(char('+'), char('-'), char('*'), char('/'), char('%'), word('=='));

const reserved = or(fTrue, fFalse, fLet, fFun, fEquals, fArrow, fIf, fElseIf, fElse, operator, fNull);

const fBool = or(fTrue, fFalse).map(mkBool);
const fNumber = number.map(mkNumber);
const fString = stringLiteral.map(mkString);

const primitive = or(fNumber, fString, fBool);

const identifier = and(not(reserved), ident)
  .map(mkIdentifier);

const defVar = and(fLet, __, identifier, __, fEquals, __, expr)
  .map(mkDefVar)
  .fail(defVarFail);

export const exprs = repSep2(expr, __);

export const block = and('{', __, exprs, __, '}')
  .map(res => res[1]);

const argumentBlock = and('(', __, repSep(identifier, ','), __, ')')
  .map(res => res[1]);

const defFun = and(fFun, __, identifier, __, argumentBlock, __, block)
  .map(mkDefFun)
  .fail(functionDefinitionFail);

const lambda = and(argumentBlock, __, fArrow, __, block)
  .map(mkLambda);

const argumentCallBlock = and('(', __, repSep(expr, ','), __, ')')
  .map(res => res[1]);

const funCall = and(__, identifier, argumentCallBlock)
  .map(mkFunctionCall)
  .fail(functionCallFail);

const infixFunCall = and(identifier, '..', identifier, argumentCallBlock)
  .map(mkFunCallInfix);

const listConstructor = and('[', repSep(expr, ','), ']')
  .map(mkList);

export const indexIntoList = and(exprWithout('indexIntoList', 'operation', 'accessObjectElement'), '[', fNumber, ']')
  .map(mkIndexIntoList);


const keyValuePair = and(__, identifier, __, ':', __, expr);

const objectConstructor = and('{', many(keyValuePair), __, '}')
  .map(mkObjectLiteral);


const objectLiteral = exprWithout('accessObjectElement', 'primitive', 'operation', 'defVar', 'defFun');

export const accessObjectElement = and(objectLiteral, '.', identifier)
  .map(mkAccessObjectElement);



const elseIfConditional = and(fElseIf, __, expr, __, block);

const elseConditional = and(__, fElse, __, block);

// TODO: "many(elseConditional)" should only accept 0 or 1.
const ifConditional = and(__, fIf, __, expr, __, block, many(elseIfConditional), many(elseConditional))
  .map(mkConditional);

const bracketed = and('(', __, expr, __, ')')
  .map(mkBracketed);

const operableExpr = exprWithout('operation');

const operation = and(operableExpr, __, many1(and(__, operator, __, operableExpr)))
  .map(mkOperator);

export function expr(): IParser {
  return exprWithout()();
}

function exprWithout(...without: string[]): WrappedParser {
  return () => {
    const parsers = {
      accessObjectElement,
      objectConstructor,
      operation,
      indexIntoList,
      infixFunCall,
      defVar,
      defFun,
      lambda,
      funCall,
      identifier,
      primitive,
      listConstructor,
      ifConditional,
      bracketed,
      fNull
    };

    const remaining: any = _.omit(parsers, without);

    const a = _.toArray(remaining) as IParser[];

    return or(...a);
  }
}
