import {cutStr} from '../_helpers/cut';

export const isProto = (str?: string) => {
    const s = cutStr(str);
    return s === 'proto2' || s === 'proto3';
};

isProto.toString = () => ' string with quotes "proto2" or "proto3" ';
