import {checkExprParse, evalCode, checkParse} from "./shared";
import {ETypes} from "../src/infix-lang/expr-types/expr";
import * as conditionals from "./conditionals";


conditionals.run();

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
  checkExprParse(ETypes.Operators, 'a.a + 2');
});


describe('Functions Defs', function() {
  checkExprParse(ETypes.FunctionDefinition, 'def sqr(x) { x * x }');
});


describe('Lambdas', () => {
  checkExprParse(ETypes.Lambda, '(x) => { x * x }');
});

describe('Lists', () => {
  checkExprParse(ETypes.List, '[1, 2, 3]');
  checkExprParse(ETypes.IndexIntoList, '[1, 2, 3][1]');
  checkExprParse(ETypes.IndexIntoList, 'a[0]');

  evalCode('let a = [1, 12, 9] a[1]', 12);
  evalCode('let a = [1, 12, 9] a[1] + 2', 14);
});

describe('Object literals', () => {
  checkExprParse(ETypes.ObjectLiteral, '{ }');
  checkExprParse(ETypes.ObjectLiteral, '{ a: 1 }');
  checkExprParse(ETypes.ObjectLiteral, '{ position: 0 code: "let a = 5" }');
});

describe('Object element access', () => {
  checkExprParse(ETypes.AccessObjectElement, 'a.b');
  checkExprParse(ETypes.AccessObjectElement, 'a.b.c');
  checkExprParse(ETypes.AccessObjectElement, 'a.b[c.d]', 'a.b[c.d]');
  checkExprParse(ETypes.AccessObjectElement, 'a.b[0].c', 'a.b[0].c');

});

describe('Function execution', () => {
  evalCode('def sqr(x) { x * x } sqr(5)', 25);
  evalCode('let a = (x) => { x + 20 } a(2)', 22);
});



