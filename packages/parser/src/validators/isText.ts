import {Symbols} from '@veksa/protobuf-tokenizer';

export const isText = (str?: unknown): str is string => {
    return typeof str === 'string' && !Symbols[str];
};

isText.toString = () => 'string';
