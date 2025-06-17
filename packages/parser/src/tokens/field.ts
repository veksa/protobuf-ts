import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {Field} from '../types';
import {getMap} from './map';
import {getInnerOptions} from './options';
import {setLastComment, writeComment} from './comment';

export const getField = (tokens: string[], empty = false) => {
    const field: Field = {
        name: '',
        type: '',
        tag: -1,
        required: false,
        repeated: false,
        optional: false,
        options: {},
    };

    setLastComment(field);

    while (tokens.length > 0) {
        switch (getNextToken(tokens)) {
            case '=':
                tokens.shift();
                field.tag = Number(tokens.shift());
                break;

            case 'map': {
                const {type, map, name} = getMap(tokens);
                field.type = type;
                field.map = map;
                field.name = name;
                break;
            }

            case 'repeated':
            case 'required':
            case 'optional': {
                const t = tokens.shift();
                field.required = t === 'required';
                field.repeated = t === 'repeated';
                field.optional = t === 'optional';
                field.type = tokens.shift() as string;
                field.name = tokens.shift() as string;
                writeComment(field);
                break;
            }

            case '[':
                field.options = getInnerOptions(tokens);
                break;

            case ';':
                if (field.name === '') {
                    throw new Thrower('field', [['Missing field name', 0]]);
                }

                if (field.type === '') {
                    throw new Thrower('field', [[`Missing type in message field: ${field.name}`, 0]]);
                }

                if (field.tag === -1) {
                    throw new Thrower('field', [[`Missing tag number in message field: ${field.name}`, 0]]);
                }

                tokens.shift();
                return field;

            case undefined:
                continue;

            default:
                if (empty) {
                    field.type = tokens.shift() as string;
                    field.name = tokens.shift() as string;
                    writeComment(field);
                } else {
                    throw new Thrower('field', [[`Unexpected token in message field: ${tokens[0]}`, 0]]);
                }
        }
    }

    throw new Thrower('field', [['No ; found for message field', 0]]);
};
