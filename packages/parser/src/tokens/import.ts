import {check} from '../_helpers/check';
import {isStr} from '../validators/isStr';
import {wrap} from '../_helpers/wrap';
import {cut, cutStr} from '../_helpers/cut';

export const getImport = (tokens: string[]) => {
    const {len, results} = check({
        type: 'import',
        tokens,
        rules: [wrap('import'), wrap(isStr, {result: true}), wrap(';')],
    });

    cut(tokens, len);

    return cutStr(results[0]);
};
