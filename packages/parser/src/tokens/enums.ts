import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Enum} from '../types';
import {check} from '../_helpers/check';
import {getInnerOptions, getOptions, insertOption} from './options';
import {writeComment} from './comment';
import {wrap} from '../_helpers/wrap';
import {cut, cutSemicolon} from '../_helpers/cut';
import {isText} from '../validators/isText';
import {isNumber} from '../validators/isNumber';

export const getEnumVal = (tokens: string[]) => {
    const {results} = check({
        type: 'enum value',
        tokens: tokens.slice(0, 4).concat(tokens[tokens.indexOf(';')]),
        rules: [wrap(isText, {result: true}), wrap('='), wrap(isNumber, {result: true}), wrap([';', '[']), wrap([';'])],
    });

    cut(tokens, 3);
    const options = tokens[0] === '['
        ? getInnerOptions(tokens)
        : {};
    cut(tokens, 1);

    return {
        name: results[0],
        value: {
            value: Number(results[1]),
            options,
        },
    };
};

export const getEnums = (tokens: string[]) => {
    const {results} = check({
        type: 'enum',
        tokens: tokens.slice(0, 3).concat(tokens[tokens.indexOf('}')]),
        rules: [wrap('enum'), wrap(isText, {result: true}), wrap('{'), wrap('}')],
    });

    const en: Enum = {
        name: results[0],
        values: {},
        options: {},
    };

    writeComment(en);

    cut(tokens, 3);

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '}':
                cut(tokens, 1);
                cutSemicolon(tokens);
                writeComment(en);
                return en;

            case 'option': {
                const {field, value} = getOptions(tokens);
                insertOption(en.options, field, value);
                break;
            }

            case undefined:
                continue;

            default: {
                const {name, value} = getEnumVal(tokens);
                en.values[name] = value;
                writeComment(en.values[name]);
            }
        }
    }

    throw new Thrower('enum', [['no close tag "}"', 0]]);
};
