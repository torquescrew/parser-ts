import * as path from 'path';
import * as fs from 'fs';


export interface IInputData {
  position: number;
  code: string;
}

export class Input {
  private code: string;
  private position: number;

  constructor(code: string) {
    this.code = code;
    this.position = 0;
  }

  advance(): void {
    this.position += 1;
  }

  advanceBy(num: number): void {
    this.position += num;
  }

  getPosition(): number {
    return this.position;
  }

  setPosition(pos: number): void {
    this.position = pos;
  }

  nextChar(): string {
    return this.code[this.position];
  }

  rest(): string {
    return this.code.slice(this.position);
  }

  snapShot(): Input {
    let snapShot = new Input(this.code);
    snapShot.setPosition(this.position);

    return snapShot;
  }

  getSlice(numChars: number): string {
    return this.code.slice(this.position, this.position + numChars);
  }

  getInputData(): IInputData {
    return {
      position: this.position,
      code: this.code
    };
  }
}

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