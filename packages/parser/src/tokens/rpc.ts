import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Method} from '../types';
import {check} from '../_helpers/check';
import {getOptions, insertOption} from './options';
import {setLastComment, writeComment} from './comment';
import {wrap} from '../_helpers/wrap';
import {cut, cutSemicolon} from '../_helpers/cut';
import {isText} from '../validators/isText';

export const getRPC = (tokens: string[]) => {
    const {results, len} = check({
        type: 'rpc',
        tokens,
        rules: [
            wrap('rpc'),
            wrap(isText, {result: true}),
            wrap('('),
            wrap('stream', {ignore: true, result: true}),
            wrap(isText, {result: true}),
            wrap(')'),
            wrap('returns'),
            wrap('('),
            wrap('stream', {ignore: true, result: true}),
            wrap(isText, {result: true}),
            wrap(')'),
        ],
    });

    cut(tokens, len);

    const rpc: Method = {
        name: results[0],
        inputType: results[2],
        outputType: results[4],
        clientStreaming: results[1] === 'stream',
        serverStreaming: results[3] === 'stream',
        options: {},
    };

    setLastComment(rpc);

    if (tokens[0] === ';') {
        tokens.shift();
        return rpc;
    }

    check({
        type: 'rpc',
        tokens: [tokens[0], tokens[tokens.indexOf('}')]],
        rules: [wrap('{'), wrap('}')],
    });

    tokens.shift();

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '}':
                cut(tokens, 1);
                cutSemicolon(tokens);
                writeComment(rpc);
                return rpc;

            case 'option': {
                const {field, value} = getOptions(tokens);
                insertOption(rpc.options, field, value);
                break;
            }

            case undefined:
                continue;

            default:
                throw new Thrower('rpc', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('rpc', [['no close tag "}"', 0]]);
};
