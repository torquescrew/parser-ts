import {
  or, char, word, number, stringLiteral, not, ident, and, __, seq, repSep, many, parseAndPrint,
  parseAll
} from "./parsers";


var expr = () => or(identifier, primitive, operation, defVar, defFunc);

//var statement = function() { return or(expr, defVar); };

var operator = or(char('+'), char('-'), char('*'), char('/'), char('%'));

var _true = word('true');
var _false = word('false');
var _var = word('var');
var _val = word('val');
var _def = word('def');
var _equals = char('=');
var _semi = char(';');

var reserved = or(_true, _false, _val, _var, _def, _equals, _semi);

var keyword = or(_var);

var cBool = or(_true, _false);

var primitive = or(number, stringLiteral, cBool);

var identifier = and(not(reserved), ident);

/*
possible results:
 - fail to parse var -> no error, no result
 - parse var, fail to parse identifier -> error parsing identifier, get error info from identifier?
 */
var defVar = seq(_var, __, identifier, __, _equals, __, expr);


var identParams = seq('(', repSep(identifier, ','), ')');

const statement = and(expr, _semi);

var block = seq('{', __, many(statement), __, '}');


var defFunc = seq(_def, __, identifier, __, identParams, __, _equals, __, block);

var operation = seq(expr, __, operator, __, expr);


export function test() {
  parseAndPrint(block, '{ var a = 5; var b = 6; }');
  parseAndPrint(defVar, 'var a = 5');
// parseAndPrint(defFunc, 'def sqr (x) = { }');
}




// export function parseCLike(code) {
//   console.log(code);
//   var result = parseAll(block, '{' + code + '}');
//
//   return result;
// }