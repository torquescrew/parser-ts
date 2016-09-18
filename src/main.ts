import * as infix from './infix-lang';
import * as path from 'path';


function main() {
  if (process.argv.length > 2) {
    const filePath = path.resolve(process.argv[2]);

    infix.parseFileAtPath(filePath);
  }
}
main();