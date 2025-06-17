import {check} from '../_helpers/check';
import {cut} from '../_helpers/cut';
import {wrap} from '../_helpers/wrap';
import {isText} from '../validators/isText';

export const getPackage = (tokens: string[]) => {
    const {len, results} = check({
        type: 'package',
        tokens,
        rules: [wrap('package'), wrap(isText, {result: true}), wrap(';')],
    });

    cut(tokens, len);

    return results[0];
};
