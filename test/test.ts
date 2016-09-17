import {expr} from "../src/infix-lang";
var assert = require('assert');
import {parse} from '../src/parser-lib/parsers-m';
import {ETypes} from "../src/infix-lang/expr-types/expr";


describe('Check expr parser results in correct type', function() {

  // describe('parse let expression', function() {
  //   it('should create a variable definition expr', function() {
  //     const result = parse(expr, 'let a = 5');
  //
  //     assert.deepEqual(result, {
  //       type: ETypes.VariableDefinition,
  //       identifier: 'a',
  //       value: '5'
  //     });
  //   });
  // });

  checkExprParse(ETypes.Boolean, 'true');
  checkExprParse(ETypes.VariableDefinition, 'let a = 5');

});


function checkExprParse(type: string, code: string) {
  describe(`"${code}"`, function() {
    it(`parsed a "${type}"`, function() {
      const result = parse(expr, code);
      assert.equal(result['type'], type);
    });
  });
}



