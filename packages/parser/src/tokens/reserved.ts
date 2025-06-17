import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Reserved} from '../types';
import {check} from '../_helpers/check';
import {wrap} from '../_helpers/wrap';
import {cut, cutStr} from '../_helpers/cut';
import {isNumber} from '../validators/isNumber';
import {isText} from '../validators/isText';

export const getReservedItem = (tokens: string[]): Reserved => {
    const {results, len, errors} = check({
        tokens,
        rules: [wrap(isNumber, {result: true}), wrap('to'), wrap(['max', isNumber], {result: true})],
    });

    if (errors.length === 0) {
        cut(tokens, len);

        const from = Number(results[0]);
        const to = results[1] === 'max'
            ? 0x1fffffff
            : Number(results[1]);

        return {from, to};
    }

    const inner = check({
        tokens,
        rules: [wrap([isNumber, isText], {result: true})],
    });

    if (inner.errors.length === 0) {
        cut(tokens, inner.len);

        const res = inner.results[0];
        return isNumber(res)
            ? Number(res)
            : cutStr(res);
    }

    throw new Thrower('reserved', errors.concat(inner.errors));
};

export const getReserved = (tokens: string[]): Reserved[] => {
    const reserved: Reserved[] = [];

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case 'reserved':
            case ',':
                cut(tokens, 1);
                reserved.push(getReservedItem(tokens));
                break;

            case ';':
                cut(tokens, 1);
                return reserved;

            case undefined:
                continue;

            default:
                throw new Thrower('reserved', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('reserved', [['no close tag ";"', 0]]);
};
