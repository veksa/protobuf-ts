import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Service} from '../types';
import {check} from '../_helpers/check';
import {getOptions, insertOption} from './options';
import {getRPC} from './rpc';
import {setLastComment, writeComment} from './comment';
import {cut, cutSemicolon} from '../_helpers/cut';
import {wrap} from '../_helpers/wrap';
import {isText} from '../validators/isText';

export const getService = (tokens: string[]) => {
    const {results, len} = check({
        type: 'service',
        tokens,
        rules: [wrap('service'), wrap(isText, {result: true}), wrap('{')],
    });

    cut(tokens, len);

    const service: Service = {
        name: results[0],
        methods: [],
        options: {},
    };

    setLastComment(service);

    while (tokens.length > 0) {
        if (tokens[0] === '}') {
            tokens.shift();
            cutSemicolon(tokens);
            writeComment(service);
            return service;
        }

        switch (getNextToken(tokens)) {
            case 'option': {
                const {field, value} = getOptions(tokens);
                insertOption(service.options, field, value);
                break;
            }

            case 'rpc':
                service.methods.push(getRPC(tokens));
                break;

            case undefined:
                continue;

            default:
                throw new Thrower('rpc', [[`Unexpected token in service: ${tokens[0]}`, 0]]);
        }
    }

    throw new Thrower('rpc', [['no close tag "}"', 0]]);
};
