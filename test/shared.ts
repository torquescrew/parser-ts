import {expr, exprs} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';
import {Expr, blockToJs, toJs} from "../src/infix-lang/expr-types/expr";

const assert = require('assert');


export function checkExprParse(type: string, code: string, output: string | null = null): void {
  describe(`"${code}"`, function() {
    let result;

    it(`${type}`, function() {
      result = parse(expr, code);

      assert.equal(result['type'], type);
    });

    if (output) {
      it(`Outputs js "${output}"`, () => {
        const jsCode = toJs(result);

        assert.equal(jsCode, output);
      });
    }
  });
}

export function checkParse(parser: any, code: string): void {
  describe(`"${code}"`, function() {
    it(`doesn't explode`, function() {
      const result = parse(parser, code);
      // console.log(result);
      // assert.equal(result['type'], type);
      assert.notEqual(result, null);
    });
  });
}

export function evalCode(code: string, result: any): void {
  describe(`"${code}"`, function() {
    it(`=> ${result}`, function() {
      const ast = parse(exprs, code) as Expr[];
      const jsCode = blockToJs(ast, false);
      assert.equal(eval(jsCode), result);
    });
  });
}

