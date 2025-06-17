import {check} from '../_helpers/check';
import {wrap} from '../_helpers/wrap';
import {cut, cutStr} from '../_helpers/cut';
import {isProto} from '../validators/isProto';

export const getSyntax = (tokens: string[]) => {
    const {range, len} = check({
        type: 'syntax',
        tokens,
        rules: [wrap('syntax'), wrap('='), wrap(isProto), wrap(';')],
    });

    cut(tokens, len);

    if (cutStr(range[2]) === 'proto2') {
        return 2;
    }

    return 3;
};
