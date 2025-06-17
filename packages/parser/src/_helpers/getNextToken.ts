import {getComment, setComment, getLastComment} from '../tokens/comment';
import {cut} from './cut';
import {isPresent} from '../_typeguards/isPresent';

export const getNextToken = (tokens: string[]): string | undefined => {
    while (tokens.length > 0) {
        switch (tokens[0]) {
            case '//': {
                const comments = cut(tokens, 2);

                const comment = getComment();

                const prefixComment = comment !== ''
                    ? `${comment}\n`
                    : comment;

                const nextComment = prefixComment + comments[1];

                setComment(nextComment);
                break;
            }

            case '/*': {
                const commentsMulti = cut(tokens, 3);

                const comment = getComment();

                const prefixComment = comment !== ''
                    ? `${comment}\n`
                    : comment;

                const nextComment = prefixComment + commentsMulti[1];

                setComment(nextComment);
                break;
            }

            case '!//': {
                const commentInline = cut(tokens, 2);

                const comment = getComment();

                const prefixComment = comment !== ''
                    ? `${comment}\n`
                    : comment;

                const nextComment = prefixComment + commentInline[1];

                const lastComment = getLastComment();

                if (isPresent(lastComment)) {
                    lastComment.comment = comment;

                    setComment('');
                } else {
                    setComment(nextComment);
                }

                break;
            }

            default:
                return tokens[0];
        }
    }

    return tokens[0];
};
