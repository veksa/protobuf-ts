import {check} from '../_helpers/check';
import {wrap} from '../_helpers/wrap';
import {cut} from '../_helpers/cut';
import {isText} from '../validators/isText';

export const getMap = (tokens: string[]) => {
    const {len, results} = check({
        type: 'map',
        tokens,
        rules: [
            wrap('map'),
            wrap('<'),
            wrap(isText, {result: true}),
            wrap(','),
            wrap(isText, {result: true}),
            wrap('>'),
            wrap(isText, {result: true}),
        ],
    });

    cut(tokens, len);

    return {
        type: 'map',
        map: {
            from: results[0],
            to: results[1],
        },
        name: results[2],
    };
};
