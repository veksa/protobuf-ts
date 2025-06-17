import {Schema} from '../types';
import {getNextToken} from '../_helpers/getNextToken';
import {Thrower} from '../_helpers/thrower';
import {getSyntax} from './syntax';
import {getPackage} from './package';
import {getMessage, getExtend} from './message';
import {getImport} from './import';
import {getEnums} from './enums';
import {getOptions, insertOption} from './options';
import {getService} from './service';
import {cleanComment, setLastComment, getComment} from './comment';

export const getSchema = (tokens: string[]) => {
    const schema: Schema = {
        syntax: 3,
        imports: [],
        enums: [],
        messages: [],
        options: {},
        extends: [],
        services: [],
    };

    cleanComment();
    setLastComment(schema);

    let first = true;

    while (tokens.length > 0) {
        const token = getNextToken(tokens);

        switch (token) {
            case 'syntax':
                if (!first) {
                    throw new Thrower('syntax', [['must be on first line', 0]]);
                }
                schema.syntax = getSyntax(tokens);
                break;

            case 'package':
                schema.package = getPackage(tokens);
                break;

            case 'message':
                schema.messages.push(getMessage(tokens));
                break;

            case 'import':
                schema.imports.push(getImport(tokens));
                break;

            case 'enum':
                schema.enums.push(getEnums(tokens));
                break;

            case 'option': {
                const {field, value} = getOptions(tokens);
                insertOption(schema.options, field, value);
                break;
            }

            case 'extend':
                schema.extends.push(getExtend(tokens));
                break;

            case 'service':
                schema.services.push(getService(tokens));
                break;

            default: {
                const comment = getComment();

                if (!comment) {
                    throw new Thrower('common', [[`Unexpected token: ${tokens[0]}`, 0]]);
                }
            }
        }
        first = false;
    }

    extendSchema(schema);

    return schema;
};

const extendSchema = (schema: Schema) => {
    for (const ext of schema.extends) {
        for (const msg of schema.messages) {
            if (msg.name === ext.name) {
                if (msg.extensions.length === 0) {
                    throw new Thrower('extends', [[`${msg.name} does not have extensions`, 0]]);
                }

                for (const field of ext.message.fields) {
                    for (const extension of msg.extensions) {
                        if (field.tag < extension.from || field.tag > extension.to) {
                            throw new Thrower('extends', [[`${msg.name} does not declare ${field.tag} as an extension number`, 0]]);
                        }
                        msg.fields.push(field);
                    }
                }
            }
        }
    }
};
