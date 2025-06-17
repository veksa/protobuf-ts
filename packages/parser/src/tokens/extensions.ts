import {check} from '../_helpers/check';
import {wrap} from '../_helpers/wrap';
import {cut} from '../_helpers/cut';
import {isNumber} from '../validators/isNumber';

export const getExtensions = (tokens: string[]) => {
    const {results, len} = check({
        type: 'extensions',
        tokens,
        rules: [
            wrap('extensions'),
            wrap(isNumber, {result: true}),
            wrap('to'),
            wrap(['max', isNumber], {result: true}),
            wrap(';'),
        ],
    });

    cut(tokens, len);

    const from = Number(results[0]);
    const to = results[1] === 'max'
        ? 0x1fffffff
        : Number(results[1]);

    return {from, to};
};
