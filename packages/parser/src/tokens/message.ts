import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Message} from '../types';
import {check} from '../_helpers/check';
import {getEnums} from './enums';
import {getExtensions} from './extensions';
import {getField} from './field';
import {getOneOf} from './oneof';
import {getAnyOf} from './anyof';
import {getOptions, insertOption} from './options';
import {getReserved} from './reserved';
import {writeComment} from './comment';
import {wrap} from '../_helpers/wrap';
import {cut} from '../_helpers/cut';
import {isText} from '../validators/isText';
import {isNumber} from '../validators/isNumber';
import {isObject} from '../_typeguards/isObject';

export const getExtend = (tokens: string[]) => {
    return {
        name: tokens[1],
        message: getMessage(tokens),
    };
};

export const getMessageBody = (tokens: string[], name: string) => {
    const message: Message = {
        name,
        enums: [],
        options: {},
        messages: [],
        fields: [],
        extends: [],
        extensions: [],
        reserved: [],
    };

    writeComment(message);

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '}':
                tokens.shift();
                writeComment(message);
                CheckReserved(message);
                return message;

            case 'map':
            case 'repeated':
            case 'optional':
            case 'required':
                message.fields.push(getField(tokens));
                break;

            case 'enum':
                message.enums.push(getEnums(tokens));
                break;

            case 'message':
                message.messages.push(getMessage(tokens));
                break;

            case 'extensions':
                message.extensions.push(getExtensions(tokens));
                break;

            case 'oneof':
                message.fields = message.fields.concat(getOneOf(tokens));
                break;

            case 'anyof':
                message.fields = message.fields.concat(getAnyOf(tokens));
                break;

            case 'extend':
                message.extends.push(getExtend(tokens));
                break;

            case ';':
                tokens.shift();
                break;

            case 'reserved':
                message.reserved.push(getReserved(tokens));
                break;

            case 'option': {
                const {field, value} = getOptions(tokens);
                insertOption(message.options, field, value);
                break;
            }

            case undefined:
                continue;

            default:
                message.fields.push(getField(tokens, true));
        }
    }

    throw new Thrower('message', [['no close tag "}"', 0]]);
};

const CheckReserved = (message: Message) => {
    for (const reserved of message.reserved) {
        for (const reserve of reserved) {
            for (const field of message.fields) {
                if (isText(reserve) && reserve === field.name) {
                    throw new Thrower('reserved', [[`Field name "${field.name}" in message "${message.name}" is reserved`, 0]]);
                } else if (isNumber(reserve) && reserve === field.tag) {
                    throw new Thrower('reserved', [
                        [`Field "${field.name}" in message "${message.name}" with tag "${field.tag}" is reserved`, 0],
                    ]);
                } else if (isObject(reserve) && reserve.from <= field.tag && field.tag <= reserve.to) {
                    throw new Thrower('reserved', [
                        [
                            // eslint-disable-next-line max-len
                            `Field "${field.name}" with tag "${field.tag}" in message "${message.name}" is reserved between ${reserve.from} to ${reserve.to}`,
                            0,
                        ],
                    ]);
                }
            }
        }
    }
};

export const getMessage = (tokens: string[]) => {
    const {len} = check({
        type: 'message',
        tokens: [tokens[0], tokens[1], tokens[2], tokens[tokens.indexOf('}')]],
        rules: [wrap(['extend', 'message']), wrap(isText), wrap('{'), wrap('}')],
    });

    const [, messageName] = cut(tokens, len - 1);

    return getMessageBody(tokens, messageName);
};
