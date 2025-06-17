import {isText} from '../_typeguards/isText';

let comment = '';
let lastComment: {comment?: string} = {};

export const writeComment = (com: {comment?: string}) => {
    const co = (com.comment ?? '') + comment;

    if (isText(co)) {
        com.comment = co;
    }

    comment = '';
    lastComment = com;
};

export const getComment = () => {
    return comment;
};

export const setComment = (nextComment: string) => {
    comment = nextComment;
};

export const cleanComment = () => {
    comment = '';
};

export const getLastComment = () => {
    return lastComment;
};

export const setLastComment = (com: {comment?: string}) => {
    lastComment = com;
};
