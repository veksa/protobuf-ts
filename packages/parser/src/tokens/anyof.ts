import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Field} from '../types';
import {check} from '../_helpers/check';
import {getField} from './field';
import {wrap} from '../_helpers/wrap';
import {cut} from '../_helpers/cut';
import {isText} from '../validators/isText';

export const getAnyOf = (tokens: string[]) => {
    const fields: Field[] = [];

    const {len, results} = check({
        type: 'anyof',
        tokens,
        rules: [wrap('anyof'), wrap(isText, {result: true}), wrap('{')],
    });

    cut(tokens, len);

    const fieldName = results[0];

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '}':
                cut(tokens, 1);

                return fields;

            case undefined:
                continue;

            default: {
                const field = getField(tokens, true);
                field.anyof = fieldName;
                fields.push(field);
            }
        }
    }

    throw new Thrower('anyof', [['no close tag "}"', 0]]);
};
