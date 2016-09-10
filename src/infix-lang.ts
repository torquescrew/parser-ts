import {char, word, or, seq, ident, and, not, __, parseAndPrint} from './parsers-m';
import {IInputData} from "./input";

const expr = () => or(identifier);

const _true = word('true');
const _false = word('false');
const _let = word('let');
const _fun = word('fun');
const _equals = char('=');
const _semi = char(';');

const reserved = or(_true, _false, _let, _fun, _equals, _semi);

var identifier = and(not(reserved), ident);

const defVar = seq(_let, __, identifier, __, _equals, __, expr).fail((inputData: IInputData, args) => {
  const parserIndex = args[0];
  const pos = inputData.position;

  if (parserIndex > 0) {
    console.log('Error: Expected identifier, found:', inputData.code.slice(pos, pos + 20));
  }
});


export function test() {
  // parseAndPrint(defVar, 'let a = b');
  parseAndPrint(defVar, 'let a = b');
}
