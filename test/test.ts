import {checkExprParse, evalCode} from "./shared";
// var assert = require('assert');
import {expr, block} from "../src/infix-lang";
import {parse, many} from '../src/parser-lib/parsers-m';
import {ETypes, Expr, blockToJs} from "../src/infix-lang/expr-types/expr";

import './conditionals';


describe('Simple expressions:', function() {
  checkExprParse(ETypes.VariableDefinition, 'let a = 5');
  checkExprParse(ETypes.Boolean, 'true');
  checkExprParse(ETypes.Number, '3');
  checkExprParse(ETypes.Number, '-3.6');
  checkExprParse(ETypes.String, '"hi there"');
  checkExprParse(ETypes.Identifier, 'squareNum2');
  checkExprParse(ETypes.FunctionCall, 'a..times(2)');
});


describe('Operators:', function() {
  checkExprParse(ETypes.Operators, '5 * 5');
  checkExprParse(ETypes.Operators, '5 * 5 + 3');
  checkExprParse(ETypes.Operators, '(5 / 5) + 3 - 5');
  checkExprParse(ETypes.Operators, 'true == false');
  // checkExprParse(ETypes.Operators, '(myFunc(5, 3) / 5) + 3 - 5');
});


describe('Functions Defs', function() {
  checkExprParse(ETypes.FunctionDefinition, 'def sqr(x) { x * x }');
});


describe('Lambdas', () => {
  checkExprParse(ETypes.Lambda, '(x) => { x * x }');
});

describe('Function execution', () => {
  evalCode('{ def sqr(x) { x * x } sqr(5) }', 25);
  evalCode('{ let a = (x) => { x + 20 } a(2) }', 22);
});

