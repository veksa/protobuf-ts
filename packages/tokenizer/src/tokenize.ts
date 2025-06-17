import {TokenType} from './types';
import {EmptySymbols, Symbols} from './constants';

// eslint-disable-next-line complexity
export const tokenize = (buf: string | Buffer) => {
    let source = buf.toString();

    if (source[source.length - 1] !== '\n') {
        source += '\n';
    }

    const tokens: string[] = [];
    const lines: number[] = [];
    const columns: number[] = [];

    let tmp = '';
    let type: TokenType = TokenType.none;
    let sameLine = true;
    let curLine = 1;
    let column = 1;

    const finalize = (after = false, force = false) => {
        if (tmp.length > 0 || force) {
            tokens.push(tmp);
            lines.push(curLine);
            columns.push(after
                ? column
                : column - tmp.length);
            tmp = '';
        }
    };

    for (let i = 0; i < source.length; i++) {
        const cur = source[i];
        const next = source[i + 1];

        switch (true) {
            case type === TokenType.none && '//' === cur + next:
                finalize();
                type = TokenType.comment;
                tmp += sameLine
                    ? '!//'
                    : '//';
                finalize(true);
                i++;
                column++;
                break;

            case type === TokenType.comment && '\n' === cur:
                type = TokenType.none;
                finalize(false, true);
                break;

            case type === TokenType.none && '/*' === cur + next:
                type = TokenType.commentMulti;
                finalize();
                tmp = '/*';
                finalize(true);
                i++;
                column++;
                break;

            case type === TokenType.commentMulti && '*/' === cur + next:
                type = TokenType.none;
                finalize(false, true);
                tmp = '*/';
                finalize(true);
                i++;
                column++;
                break;

            case type === TokenType.none && cur === '\'':
                finalize();
                tmp = cur;
                type = TokenType.oneString;
                break;

            case type === TokenType.oneString && cur + next === '\\\'':
                tmp += '\'';
                i++;
                break;

            case type === TokenType.oneString && cur === '\'':
                tmp += cur;
                finalize();
                type = TokenType.none;
                break;

            case type === TokenType.none && cur === '"':
                finalize();
                tmp = cur;
                type = TokenType.twoString;
                break;

            case type === TokenType.twoString && cur + next === '\\"':
                tmp += '"';
                i++;
                break;

            case type === TokenType.twoString && cur === '"':
                tmp += cur;
                finalize();
                type = TokenType.none;
                break;

            case type === TokenType.none && Symbols[cur]:
                finalize();
                tmp = cur;
                finalize(true);
                break;

            case type === TokenType.none && EmptySymbols[cur]:
                finalize();
                break;

            default:
                tmp += cur;
        }

        if (type === TokenType.none && cur === '\n') {
            column = 1;
        } else {
            column++;
        }

        if (cur === '\n') {
            sameLine = false;
            curLine++;
        } else if (!EmptySymbols[cur]) {
            sameLine = true;
        }
    }

    return {
        tokens,
        lines,
        columns,
    };
};
