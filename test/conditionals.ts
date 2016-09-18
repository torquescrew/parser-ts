import {checkExprParse} from "./shared";
var assert = require('assert');
import {expr} from "../src/infix-lang";
import {parse} from '../src/parser-lib/parsers-m';
import {ETypes} from "../src/infix-lang/expr-types/expr";


describe('Conditionals:', function() {
  checkExprParse(ETypes.Conditional, 'if a { let b = a }');
  checkExprParse(ETypes.Conditional, 'if a { let a = 5 } else if b { let b = c } else { let a = 3 }');
});


