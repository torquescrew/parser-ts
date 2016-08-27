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


}