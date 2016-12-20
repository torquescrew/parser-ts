import {checkExprParse} from "./shared";
import {ETypes} from "../src/infix-lang/expr-types/expr";
// const assert = require('assert');


describe('Conditionals:', function() {
  checkExprParse(ETypes.Conditional, 'if a { let b = a }');
  checkExprParse(ETypes.Conditional, 'if a { let a = 5 } else if b { let b = c } else { let a = 3 }');
});


