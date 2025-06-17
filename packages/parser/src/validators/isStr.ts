import {isText} from './isText';

export const isStr = (str?: unknown): str is string => {
    return isText(str)
        ? (str.slice(0, 1) === '"' && str.slice(-1) === '"') || (str.slice(0, 1) === '\'' && str.slice(-1) === '\'')
        : false;
};

isStr.toString = () => ' string with quotes "..." or \'...\' ';
