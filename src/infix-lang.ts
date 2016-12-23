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
  repSep
} from "./parser-lib/parsers-m";
import {defVarFail, mkDefVar} from "./infix-lang/expr-types/variable-definition";
import {mkFunctionCall, mkFunCallInfix, functionCallFail} from "./infix-lang/expr-types/function-call";
import {toJs, mkBool, mkNumber, mkString, mkIdentifier, mkBracketed} from "./infix-lang/expr-types/expr";
import {mkDefFun, functionDefinitionFail} from "./infix-lang/expr-types/function-definition";
import {mkConditional} from "./infix-lang/expr-types/conditionals";
import {mkOperator} from "./infix-lang/expr-types/operation";
import {mkLambda} from "./infix-lang/expr-types/lambda";


const fTrue = word('true');
const fFalse = word('false');
const fLet = word('let');
const fFun = word('def');
const fEquals = char('=');
const fArrow = word('=>');

const fIf = word('if');
const fElseIf = word('else if');
const fElse = word('else');

const operator = or(char('+'), char('-'), char('*'), char('/'), char('%'), word('=='));

const reserved = or(fTrue, fFalse, fLet, fFun, fEquals, fArrow, fIf, fElseIf, fElse, operator);

const fBool = or(fTrue, fFalse).map(mkBool);
const fNumber = number.map(mkNumber);
const fString = stringLiteral.map(mkString);

const primitive = or(fNumber, fString, fBool);

const identifier = and(not(reserved), ident)
  .map(mkIdentifier);

const defVar = and(__, fLet, __, identifier, __, fEquals, __, expr, __)
  .map(mkDefVar)
  .fail(defVarFail);

export const block = and('{', __, many(expr), __, '}')
  .map(res => res[1]);

const argumentBlock = and(__, '(', __, repSep(identifier, ','), __, ')', __)
  .map(res => res[1]);

const defFun = and(__, fFun, __, identifier, __, argumentBlock, __, block)
  .map(mkDefFun)
  .fail(functionDefinitionFail);

const lambda = and(argumentBlock, fArrow, __, block)
  .map(mkLambda);

const argumentCallBlock = and(__, '(', __, repSep(expr, ','), __, ')', __)
  .map(res => res[1]);

const funCall = and(__, identifier, argumentCallBlock)
  .map(mkFunctionCall)
  .fail(functionCallFail);

const infixFunCall = and(identifier, '..', identifier, argumentCallBlock)
  .map(mkFunCallInfix);

const elseIfConditional = and(__, fElseIf, __, expr, __, block, __);

const elseConditional = and(__, fElse, __, block, __);

const ifConditional = and(__, fIf, __, expr, __, block, many(elseIfConditional), many(elseConditional))
  .map(mkConditional);

const bracketed = and(__, '(', __, expr, __, ')', __)
  .map(mkBracketed);

const operatableExpr = or(bracketed, infixFunCall, identifier, primitive, funCall, ifConditional);

const operation = and(operatableExpr, __, many1(and(__, operator, __, operatableExpr))).map(mkOperator);

export function expr() {
  return or(operation, infixFunCall, defVar, defFun, lambda, funCall, identifier, primitive, ifConditional, bracketed, 'null');
}

// export function parseFileAtPath(filePath) {
//   const result = parseFile(many(expr).map(toJs), filePath);
//
//   const beautify = require('js-beautify')['js_beautify'];
//   console.log(beautify(result));
// }
