import {word, char, or, ident, not, and, repSep, many, __, number, stringLiteral, many1} from "../parser-lib/parsers-m";
import {toJs} from "../infix-lang/expr-types/expr";


const _if = word('if');
const _def = word('def');
const _defn = word('defn');
const _fn = word('fn');
const _macro = word('defmacro');
const _true = word('true');
const _false = word('false');
const _null = word('null');
const _jscode = word('jscode');

const operator = or(char('+'), char('-'), char('*'), char('/'), char('%'), char('='));

const keyword = or(_if, _def, _fn, _defn, _macro, _true, _false, _null, _jscode);

const identifier = and(not(keyword), ident);

const jsAccessor = and(char('.'), repSep(identifier, '.'));

const accessor = repSep(identifier, '.');

const symbol = or(accessor, jsAccessor);

const identParams = and('[', many(and(identifier, __)), ']');

const lNumber = number;

const lString = stringLiteral;

const lBool = or(_true, _false);

const primitive = or(lNumber, lString, lBool);

const block = many1(and(expr, __));

const funcBlock = block;

const argsBlock = block;

const funcName = or(symbol, operator);

const funcCall = and('(', __, funcName, __, argsBlock, __, ')');

const def = and('(', __, _def, __, identifier, __, expr, __, ')');

const defn = and('(', __, _defn, __, identifier, __, identParams, __, funcBlock, ')');

const lambda = and('(', __, _fn, __, identParams, __, funcBlock, ')');

const list = and("'(", __, argsBlock, ')');

const macroDef = and('(', __, _macro, __, identifier, __, identParams, __, funcBlock, ')');

const lIf = and('(', __, _if, __, expr, __, expr, __, expr, __, ')');

const quotedBlock = and('`(', __, argsBlock, ')');

const jsCode = and('(', __, _jscode, __, argsBlock, __, ')');

export function expr() {
   return or(
      macroDef,
      primitive,
      funcCall,
      // symbol,
      def,
      lambda,
      defn,
      list,
      lIf,
      quotedBlock,
      jsCode,
      and('(', __, expr, __, ')')
   );
}