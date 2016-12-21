import {expr} from '../../src/lisp/lisp';
import {parse} from "../../src/parser-lib/parsers-m";


describe('expressions:', function() {
   it('should be sweet', function() {
      console.log(parse(expr, 'false'));
      console.log(parse(expr, '5'));
      console.log(parse(expr, '(def a 1)'));
      console.log(parse(expr, 'aa'));

   });
});