import {
  char, word, or, and, ident, not, __, many, parseAndPrint, stringLiteral,
  number, repSep
} from './parser-lib/parsers-m';
import {IInputData} from "./input";


const _true = word('true');
const _false = word('false');
const _let = word('let');
const _fun = word('fun');
const _equals = char('=');
const _semi = char(';');

const reserved = or(_true, _false, _let, _fun, _equals, _semi);

const cBool = or(_true, _false);

const primitive = or(number, stringLiteral, cBool);
const identifier = and(not(reserved), ident);

const defVar = and(__, _let, __, identifier, __, _equals, __, expr, _semi, __).fail((inputData: IInputData, extra) => {
  const pos = inputData.position;

  if (extra && extra['parserIndex'] > 1) {
    console.log('Error: Expected identifier, found:', inputData.code.slice(pos, pos + 20));
  }
});

// const statement: IParser = and(__, expr, _semi, __);

const block = and('{', __, many(expr), __, '}');

const argumentBlock = and(__, '(', __, repSep(identifier, ','), __, ')', __);

const defFun = and(__, _fun, __, identifier, __, argumentBlock, __, block).fail((inputData: IInputData, extra) => {
  if (extra && extra['parserIndex'] > 1) {
    console.log('defFun parse error: ', inputData, extra);
  }
});

function expr() {
  return or(identifier, primitive, defVar, defFun);
}

export function test() {
  // parseAndPrint(many(expr), 'let a = 5;');
  // parseAndPrint(block, '{ let a = 5; let b = 6; }');
  // parseAndPrint(block, '{ 5; }');
  // parseAndPrint(defFun, 'fun square(n) { 5 }');
  parseAndPrint(many(expr), 'let a =2; fun charles (a) { let a = 5; let b = 6; }');
}
