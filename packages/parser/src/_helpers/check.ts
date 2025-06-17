import {Thrower} from './thrower';
import {Tokens} from '../types';
import {wrap} from './wrap';
import {isString} from '../_typeguards/isString';

type Checks = ReturnType<typeof wrap>;

type Config = {
    type?: string;
    rules: Checks[];
    tokens: Tokens;
};

export const check = (config: Config) => {
    const {type, rules, tokens} = config;

    const errors: [string, number][] = [];
    const results: string[] = [];
    const range: Tokens = tokens.slice(0, rules.length);

    let len = 0;

    for (let i = 0; i < rules.length; i++) {
        const {rule, config} = rules[i];
        const val = Array.isArray(rule)
            ? rule
            : [rule];

        const index = config?.strict === true
            ? i
            : len;
        const token = tokens[index] ?? '';

        let valid = false;

        for (const validator of val) {
            if (!valid) {
                valid = typeof validator === 'function'
                    ? validator(token)
                    : token === validator;
            }
        }

        if (config?.result === true) {
            const item = valid
                ? token
                : '';

            results.push(item);
        }
        if (!valid && config?.ignore !== true) {
            errors.push([`Token "${token}" not equal "${val.join(',')}"`, i]);
        }
        if (valid || (!valid && config?.ignore !== true)) {
            len++;
        }
    }

    if (errors.length > 0 && isString(type)) {
        errors.push([range.join(', '), 0]);
        throw new Thrower(type, errors);
    }

    return {
        errors,
        results,
        range,
        len: len,
    };
};
