import * as infix from './infix-lang';
import * as path from 'path';
import {IParser} from "./parser-lib/types";
import {Input} from "./input";
import * as fs from 'fs';
import {applyParser, many} from "./parser-lib/parsers-m";
import {expr} from "./infix-lang";
import {toJs} from "./infix-lang/expr-types/expr";



export function makeInputFromFile(filePath: string): Input | null {
  try {
    fs.statSync(filePath);

    const fileContent = fs.readFileSync(filePath).toString();

    if (fileContent) {
      const code = fileContent.replace(/[\r\n]+/g, " ");

      return new Input(code);
    }
  }
  catch (e) {
    console.log(e);
    return null;
  }
  return null;
}

export function parseFile(parser: IParser, fileName: string): string {
  const input = makeInputFromFile(fileName);
  if (input !== null) {
    const result = applyParser(parser, input);

    if (result === null) {
      return 'Compile failed.';
    }
    else {
      return result;
    }
  }
  return 'failed to read file';
}

export function parseFileAtPath(filePath) {
  const result = parseFile(many(expr).map(toJs), filePath);
  const beautify = require('js-beautify')['js_beautify'];

  console.log(beautify(result));
}


function main() {
  if (process.argv.length > 2) {
    const filePath = path.resolve(process.argv[2]);

    parseFileAtPath(filePath);
  }
}
main();