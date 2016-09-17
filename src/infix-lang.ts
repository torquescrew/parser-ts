import {
  char, word, or, and, ident, not, __, many, parseAndPrint, stringLiteral,
  number, repSep, parseAndPrintFile, parseFile
} from './parser-lib/parsers-m';
import {IInputData} from "./input";
import * as path from 'path';
import {defVarFail, mkDefVar} from "./infix-lang/expr-types/def-var";
import {mkFunCall, mkFunCallInfix} from "./infix-lang/expr-types/fun-call";
import {toJs, mkBool, mkNumber, mkString} from "./infix-lang/expr-types/expr";
import {mkDefFun} from "./infix-lang/expr-types/def-fun";
// import * as beautify from 'js-beautify';
const beautify = require('js-beautify')['js_beautify'];


const _true = word('true');
const _false = word('false');
const _let = word('let');
const _fun = word('fun');
const _equals = char('=');


const reserved = or(_true, _false, _let, _fun, _equals);

const fBool = or(_true, _false).map(mkBool);
const fNumber = number.map(mkNumber);
const fString = stringLiteral.map(mkString);

const primitive = or(fNumber, fString, fBool);

const identifier = and(not(reserved), ident).map(r => r[0]);

const defVar = and(__, _let, __, identifier, __, _equals, __, expr, __).fail(defVarFail).map(mkDefVar);

// const statement: IParser = and(__, expr, _semi, __);

const block = and('{', __, many(expr), __, '}').map(res => res[1]);

const argumentBlock = and(__, '(', __, repSep(identifier, ','), __, ')', __).map(res => res[1]);

const defFun = and(__, _fun, __, identifier, __, argumentBlock, __, block).fail((inputData: IInputData, extra) => {
  if (extra && extra['parserIndex'] > 1) {
    console.log('defFun parse error: ', inputData, extra);
  }
}).map(mkDefFun).map(toJs);

const argumentCallBlock = and(__, '(', __, repSep(expr, ','), __, ')', __).map(res => res[1]);

const funCall = and(__, identifier, argumentCallBlock).fail((input, extra) => {
  if (extra && extra['parserIndex'] > 1) {
    console.log('funCall parse error: ', input, extra);
  }
}).map(mkFunCall).map(toJs);

const infixFunCall = and(identifier, '..', identifier, argumentCallBlock).map(mkFunCallInfix).map(toJs);

export function expr() {
  return or(infixFunCall, identifier, primitive, defVar, defFun, funCall);
}

export function test() {
  // parseAndPrint(many(expr), 'let a = 5;');
  // parseAndPrint(block, '{ let a = 5; let b = 6; }');
  // parseAndPrint(block, '{ 5; }');
  // parseAndPrint(defFun, 'fun square(n) { 5 }');
  // parseAndPrint(funCall, 'myFunc(1);');
  // parseAndPrint(many(expr), 'a..times(2);');
  // parseAndPrint(many(expr), 'let a =2; a..times(2); fun myFunc (a) { let a = 5; let b = 6; a..times(2); } myFunc(5, 3);');

  const result = parseFile(many(expr).map(toJs), path.join(process.cwd(), 'example-code', 'e1.fs'));


  // beautify(result);
  console.log(beautify(result));
}
