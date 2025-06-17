import {Thrower} from './_helpers/thrower';
import {getSchema} from './tokens/schema';
import {tokenize} from '@veksa/protobuf-tokenizer';

export const parse = (buf: string | Buffer) => {
    const {tokens, lines, columns} = tokenize(buf);

    try {
        return getSchema(tokens);
    } catch (e) {
        if (e instanceof Thrower) {
            e.addRange(tokens);
            e.addLine(lines[lines.length - tokens.length]);
            e.addColumn(columns[lines.length - tokens.length + e.message[0][1]]);
        }
        throw e;
    }
};
