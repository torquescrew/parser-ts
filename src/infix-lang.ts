import {
  char, word, or, seq, ident, not, __, many, parseAndPrint, stringLiteral,
  number
} from './parser-lib/parsers-m';
import {IInputData} from "./input";
import {IParser} from "./parser-lib/types";


const _true = word('true');
const _false = word('false');
const _let = word('let');
const _fun = word('fun');
const _equals = char('=');
const _semi = char(';');

const reserved = or(_true, _false, _let, _fun, _equals, _semi);

const cBool = or(_true, _false);

const primitive = or(number, stringLiteral, cBool);
const identifier = seq(not(reserved), ident);

const defVar = seq(_let, __, identifier, __, _equals, __, expr).fail((inputData: IInputData, args) => {
  const parserIndex = args[0];
  const pos = inputData.position;

  if (parserIndex > 0) {
    console.log('Error: Expected identifier, found:', inputData.code.slice(pos, pos + 20));
  }
});

const statement: IParser = seq(__, expr, _semi, __);

const block = seq('{', __, many(statement), __, '}');

function expr() {
  return or(identifier, defVar, primitive);
}

export function test() {
  parseAndPrint(statement, 'let a = 5;');
  parseAndPrint(block, '{ let a = 5; let b = 6; }');
}
