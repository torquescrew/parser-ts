import {expr, block} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';
import {Expr, blockToJs} from "../src/infix-lang/expr-types/expr";

const assert = require('assert');


export function checkExprParse(type: string, code: string): void {
  describe(`"${code}"`, function() {
    it(`${type}`, function() {
      const result = parse(expr, code);
      assert.equal(result['type'], type);
    });
  });
}

export function evalCode(code: string, result: any): void {
  describe(`"${code}"`, function() {
    it(`equals ${result}`, function() {
      const ast = parse(block, code) as Expr[];
      const jsCode = blockToJs(ast, false);
      assert.equal(eval(jsCode), result);
    });
  });
}