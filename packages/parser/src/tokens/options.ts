import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Option, Options} from '../types';
import {check} from '../_helpers/check';
import {isPresent} from '../_typeguards/isPresent';
import {setLastComment, writeComment} from './comment';
import {cutStr, cut, cutSemicolon} from '../_helpers/cut';
import {wrap} from '../_helpers/wrap';
import {isNumber} from '../validators/isNumber';
import {isStr} from '../validators/isStr';
import {isText} from '../validators/isText';

const getValue = (value?: string) => {
    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    if (isNumber(value)) {
        return value;
    }

    if (isStr(value)) {
        return cutStr(value);
    }

    return value;
};

export const getOptionValue = (tokens: string[]): Option => {
    const value = tokens.shift();

    if (value !== '{') {
        return getValue(value);
    }

    const result: Options = {};

    let field: string | undefined;

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '}':
                cut(tokens, 1);
                return result;

            case ':':
                cut(tokens, 1);
                insertOption(result, field, tokens[0] === '['
                    ? getOptionArray(tokens)
                    : getOptionValue(tokens));
                break;

            case '{':
                insertOption(result, field, getOptionValue(tokens));
                break;

            case undefined:
                continue;

            default:
                field = tokens.shift();
        }
    }

    throw new Thrower('option array', [['no close tag "}"', 0]]);
};

export const getOptionArray = (tokens: string[]): Option[] => {
    const options: Option[] = [];

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '[':
            case ',':
                cut(tokens, 1);
                options.push(getOptionValue(tokens));
                break;

            case ']':
                cut(tokens, 1);
                return options;

            case undefined:
                continue;

            default:
                throw new Thrower('options array', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('options array', [['no close tag "]"', 0]]);
};

export const getOption = (tokens: string[]) => {
    const {len, results} = check({
        type: 'option',
        tokens,
        rules: [
            wrap('(', {ignore: true}),
            wrap(isText, {result: true}),
            wrap(')', {ignore: true}),
            wrap(isText, {result: true, ignore: true}),
            wrap('='),
            wrap([isText, '{']),
        ],
    });

    cut(tokens, len - 1);
    const field = results[0] + results[1];
    const value = getOptionValue(tokens);

    return {field, value};
};

export const getInnerOptions = (tokens: string[]) => {
    const options: Options = {};

    setLastComment(options);

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '[':
            case ',': {
                cut(tokens, 1);
                const {field, value} = getOption(tokens);

                const path = field.split('.');
                const lastFieldName = path.pop();

                let opt = options;

                for (const p of path) {
                    if (!isPresent(opt[p])) {
                        opt[p] = {};
                    }
                    opt = opt[p] as Options;
                }

                insertOption(opt, lastFieldName, value);
                break;
            }

            case ']':
                cut(tokens, 1);
                writeComment(options);
                return options;

            case undefined:
                continue;

            default:
                throw new Thrower('inner options', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('inner options', [['no close tag "]"', 0]]);
};

export const getOptions = (tokens: string[]) => {
    const {len} = check({tokens, rules: [wrap('option')], type: 'option'});

    cut(tokens, len);

    const result = getOption(tokens);

    cutSemicolon(tokens);

    return result;
};

export const insertOption = (
    result: Options,
    field: string | undefined,
    out: string | boolean | Options | Option[] | undefined,
) => {
    if (!isText(field)) {
        throw new Thrower('insert option', [['No any field name', 0]]);
    }

    if (isPresent(result[field])) {
        if (Array.isArray(result[field])) {
            if (Array.isArray(out)) {
                result[field] = (result[field] as Option[]).concat(out);
            } else {
                (result[field] as Option[]).push(out);
            }
        } else {
            result[field] = [result[field]];
            (result[field] as Option[]).push(out);
        }
    } else {
        result[field] = out;
    }
};
