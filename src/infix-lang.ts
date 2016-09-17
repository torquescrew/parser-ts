import {
  char, word, or, and, ident, not, __, many, parseAndPrint, stringLiteral,
  number, repSep, parseAndPrintFile, parseFile
} from './parser-lib/parsers-m';
import {IInputData} from "./input";
import * as path from 'path';
import {defVarFail, mkDefVar} from "./infix-lang/expr-types/variable-definition";
import {mkFunctionCall, mkFunCallInfix, functionCallFail} from "./infix-lang/expr-types/function-call";
import {toJs, mkBool, mkNumber, mkString, mkIdentifier} from "./infix-lang/expr-types/expr";
import {mkDefFun, functionDefinitionFail} from "./infix-lang/expr-types/function-definition";

const beautify = require('js-beautify')['js_beautify'];


const fTrue = word('true');
const fFalse = word('false');
const fLet = word('let');
const fFun = word('fun');
const fEquals = char('=');


const reserved = or(fTrue, fFalse, fLet, fFun, fEquals);

const fBool = or(fTrue, fFalse).map(mkBool);
const fNumber = number.map(mkNumber);
const fString = stringLiteral.map(mkString);

const primitive = or(fNumber, fString, fBool);

const identifier = and(not(reserved), ident)
  .map(mkIdentifier);

const defVar = and(__, fLet, __, identifier, __, fEquals, __, expr, __)
  .map(mkDefVar)
  .fail(defVarFail);

const block = and('{', __, many(expr), __, '}')
  .map(res => res[1]);

const argumentBlock = and(__, '(', __, repSep(identifier, ','), __, ')', __)
  .map(res => res[1]);

const defFun = and(__, fFun, __, identifier, __, argumentBlock, __, block)
  .map(mkDefFun)
  .fail(functionDefinitionFail);

const argumentCallBlock = and(__, '(', __, repSep(expr, ','), __, ')', __)
  .map(res => res[1]);

const funCall = and(__, identifier, argumentCallBlock)
  .map(mkFunctionCall)
  .fail(functionCallFail);

const infixFunCall = and(identifier, '..', identifier, argumentCallBlock)
  .map(mkFunCallInfix);

export function expr() {
  return or(infixFunCall, identifier, primitive, defVar, defFun, funCall);
}

export function test() {
  const result = parseFile(many(expr).map(toJs), path.join(process.cwd(), 'example-code', 'e1.fs'));

  console.log(beautify(result));
}
