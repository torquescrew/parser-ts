var assert = require('assert');

import {expr} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';
import {ETypes} from "../src/infix-lang/expr-types/expr";


describe('expr parser should output correct type', function() {

  checkExprParse(ETypes.VariableDefinition, 'let a = 5');
  checkExprParse(ETypes.Boolean, 'true');
  checkExprParse(ETypes.Number, '3');
  checkExprParse(ETypes.Number, '-3.6');
  checkExprParse(ETypes.String, '"hi there"');
  checkExprParse(ETypes.Identifier, 'squareNum2');
  checkExprParse(ETypes.FunctionCall, 'a..times(2)');

});


function checkExprParse(type: string, code: string): void {
  describe(`"${code}"`, function() {
    it(`${type}`, function() {
      const result = parse(expr, code);
      assert.equal(result['type'], type);
    });
  });
}

describe('conditionals', function() {
  checkExprParse(ETypes.Conditional, 'if a { let b = a }');
  checkExprParse(ETypes.Conditional, 'if a { let a = 5 } else if b { let b = c } else { let a = 3 }');

  // it('parses', function() {
  //   const result = parse(expr, 'if a { let a = 5 } else if b { } else { let a = 3 }');
  //   console.log(result);
  // });
});



