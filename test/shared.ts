import {expr} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';

const assert = require('assert');


export function checkExprParse(type: string, code: string): void {
  describe(`"${code}"`, function() {
    it(`${type}`, function() {
      const result = parse(expr, code);
      assert.equal(result['type'], type);
    });
  });
}