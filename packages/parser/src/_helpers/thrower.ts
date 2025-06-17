import {Tokens} from '../types';

export class Thrower {
    public name: string;
    public message: [string, number][];

    public line = 0;
    public column = 0;
    public range: Tokens = [];

    constructor(name: string, message: [string, number][]) {
        this.name = name;
        this.message = message;
    }

    public addLine(num: number) {
        this.line = num;
    }

    public addColumn(num: number) {
        this.column = num;
    }

    public addRange(range: Tokens) {
        this.range = range.length > 10
            ? range.slice(0, 5).concat(['...'], range.slice(-5))
            : range;
    }
}
