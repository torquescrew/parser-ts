import {checkExprParse, evalCode} from "./shared";
import {ETypes} from "../src/infix-lang/expr-types/expr";


import "./conditionals";

describe('Simple expressions:', function() {
  checkExprParse(ETypes.VariableDefinition, 'let a = 5');
  checkExprParse(ETypes.Boolean, 'true');
  checkExprParse(ETypes.Number, '3');
  checkExprParse(ETypes.Number, '-3.6');
  checkExprParse(ETypes.String, '"hi there"');
  checkExprParse(ETypes.Identifier, 'square[Num2');
  checkExprParse(ETypes.FunctionCall, 'a..times(2)');
});


describe('Operators:', function() {
  checkExprParse(ETypes.Operators, '5 * 5');
  checkExprParse(ETypes.Operators, '5 * 5 + 3');
  checkExprParse(ETypes.Operators, '(5 / 5) + 3 - 5');
  checkExprParse(ETypes.Operators, 'true == false');
});


describe('Functions Defs', function() {
  checkExprParse(ETypes.FunctionDefinition, 'def sqr(x) { x * x }');
});


describe('Lambdas', () => {
  checkExprParse(ETypes.Lambda, '(x) => { x * x }');
});

describe('Lists', () => {
  checkExprParse(ETypes.List, '[1, 2, 3]');
});

describe('Function execution', () => {
  evalCode('def sqr(x) { x * x } sqr(5)', 25);
  evalCode('let a = (x) => { x + 20 } a(2)', 22);
});

