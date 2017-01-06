import {
  char,
  word,
  or,
  and2,
  ident,
  not,
  __,
  many,
  many1,
  stringLiteral,
  number,
  repSep,
  repParserSep
} from "./parser-lib/parsers-m";
import {defVarFail, mkDefVar} from "./infix-lang/expr-types/variable-definition";
import {mkFunctionCall, mkFunCallInfix, functionCallFail} from "./infix-lang/expr-types/function-call";
import {mkBool, mkNumber, mkString, mkIdentifier, mkBracketed, mkNull} from "./infix-lang/expr-types/expr";
import {mkDefFun, functionDefinitionFail} from "./infix-lang/expr-types/function-definition";
import {mkConditional} from "./infix-lang/expr-types/conditionals";
import {mkOperator} from "./infix-lang/expr-types/operation";
import {mkLambda} from "./infix-lang/expr-types/lambda";
import {mkList, mkIndexIntoList} from "./infix-lang/expr-types/list";
import * as _ from "underscore";
import {IParser, WrappedParser} from "./parser-lib/types";
import {mkObjectLiteral, mkAccessObjectElement} from "./infix-lang/expr-types/object-literal";


export const expr = exprWithout();

const fTrue = word('true');
const fFalse = word('false');
const fLet = word('let');
const fFun = word('def');
const fEquals = char('=');
const fArrow = word('=>');

const fIf = word('if');
const fElseIf = word('else if');
const fElse = word('else');

const fNull = word('null').map(mkNull);

const operator = or(char('+'), char('-'), char('*'), char('/'), char('%'), word('=='));

const reserved = or(fTrue, fFalse, fLet, fFun, fEquals, fArrow, fIf, fElseIf, fElse, operator, fNull);

const fBool = or(fTrue, fFalse).map(mkBool);
const fNumber = number.map(mkNumber);
const fString = stringLiteral.map(mkString);

const primitive = or(fNumber, fString, fBool);

const identifier = and2(not(reserved), ident)
  .map(mkIdentifier);

const defVar = and2(fLet, __, identifier, __, fEquals, __, expr)
  .map(mkDefVar)
  .fail(defVarFail);

const openBrace = char('{');
const closeBrace = char('}');
const openParen = char('(');
const closeParen = char(')');
const openBrack = char('[');
const closeBrack = char(']');
const colon = char(':');
const dotDot = word('..');
const dot = char('.');

export const exprs = repParserSep(expr, __);

const block = and2(openBrace, __, exprs, __, closeBrace)
  .map(res => res[1]);

const argumentBlock = and2(openParen, __, repSep(identifier, ','), __, closeParen)
  .map(res => res[1]);

const defFun = and2(fFun, __, identifier, __, argumentBlock, __, block)
  .map(mkDefFun)
  .fail(functionDefinitionFail);

const lambda = and2(argumentBlock, __, fArrow, __, block)
  .map(mkLambda);

const argumentCallBlock = and2(openParen, __, repSep(expr, ','), __, closeParen)
  .map(res => res[1]);

const funCall = and2(__, identifier, argumentCallBlock)
  .map(mkFunctionCall)
  .fail(functionCallFail);

const infixFunCall = and2(identifier, dotDot, identifier, argumentCallBlock)
  .map(mkFunCallInfix);

const listConstructor = and2(openBrack, repSep(expr, ','), closeBrack)
  .map(mkList);

const listLiteral = () => or(
  infixFunCall,
  funCall,
  identifier,
  listConstructor,
  ifConditional,
  bracketed,
);

const possibleNumber = () => or(fNumber, accessObjectElement, identifier);

const indexIntoList = and2(listLiteral, openBrack, possibleNumber, closeBrack)
  .map(mkIndexIntoList);

const keyValuePair = and2(__, identifier, __, colon, __, expr);

const objectConstructor = and2(openBrace, many(keyValuePair), __, closeBrace)
  .map(mkObjectLiteral);


const possibleObject = exprWithout(
  'objectConstructor',
  'accessObjectElement',
  'lambda',
  'primitive',
  'operation',
  'defVar',
  'defFun',
  'fNull',
  'listConstructor');

const accessObjectElement = and2(possibleObject, dot, repParserSep(possibleObject, dot))
  .map(mkAccessObjectElement);


const elseIfConditional = and2(fElseIf, __, expr, __, block);

const elseConditional = and2(__, fElse, __, block);

// TODO: "many(elseConditional)" should only accept 0 or 1.
const ifConditional = and2(__, fIf, __, expr, __, block, many(elseIfConditional), many(elseConditional))
  .map(mkConditional);

const bracketed = and2(openParen, __, expr, __, closeParen)
  .map(mkBracketed);

const operableExpr = exprWithout(
  'operation',
  'objectConstructor',
  'listConstructor',
  'defVar',
  'defFun',
  'lambda',
  'fNull'
);

const operation = and2(operableExpr, __, many1(and2(__, operator, __, operableExpr)))
  .map(mkOperator);


function exprWithout(...without: string[]): WrappedParser {
  return () => {
    const parsers = {
      objectConstructor,
      operation,
      accessObjectElement,
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
