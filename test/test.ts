var assert = require('assert');
import {expr} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';
import {ETypes} from "../src/infix-lang/expr-types/expr";


describe('Simple expressions:', function() {
  checkExprParse(ETypes.VariableDefinition, 'let a = 5');
  checkExprParse(ETypes.Boolean, 'true');
  checkExprParse(ETypes.Number, '3');
  checkExprParse(ETypes.Number, '-3.6');
  checkExprParse(ETypes.String, '"hi there"');
  checkExprParse(ETypes.Identifier, 'squareNum2');
  checkExprParse(ETypes.FunctionCall, 'a..times(2)');
});

describe('Conditionals:', function() {
  checkExprParse(ETypes.Conditional, 'if a { let b = a }');
  checkExprParse(ETypes.Conditional, 'if a { let a = 5 } else if b { let b = c } else { let a = 3 }');
});

describe('Operators:', function() {
  checkExprParse(ETypes.Operators, '5 * 5');
  checkExprParse(ETypes.Operators, '5 * 5 + 3');
  checkExprParse(ETypes.Operators, '(5 / 5) + 3 - 5');
  // checkExprParse(ETypes.Operators, '(myFunc(5, 3) / 5) + 3 - 5');
});


function checkExprParse(type: string, code: string): void {
  describe(`"${code}"`, function() {
    it(`${type}`, function() {
      const result = parse(expr, code);
      assert.equal(result['type'], type);
    });
  });
}