var assert = require('assert');
import {expr} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';



export function checkExprParse(type: string, code: string): void {
  describe(`"${code}"`, function() {
    it(`${type}`, function() {
      const result = parse(expr, code);
      assert.equal(result['type'], type);
    });
  });
}