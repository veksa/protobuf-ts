import {Field} from '@veksa/protobuf-parser';
import {IEnum} from "./types";
import {isString} from "./_typeguards/isString";
import {TYPES} from "./constants";

export const getFieldType = (field: Field, enumList: IEnum[]): {type: string, depends: string[]} => {
    const {type} = field;

    if (field.repeated) {
        if (field.options.packed === true) {
            const {type: fieldType, depends} = getFieldType({type} as Field, enumList);

            return {
                type: `['repeated-packed', ${fieldType}]`,
                depends,
            };
        }

        const {type: fieldType, depends} = getFieldType({type} as Field, enumList);

        return {
            type: `['repeated-simple', ${fieldType}]`,
            depends,
        };
    }

    if (field.map) {
        const {type: fieldType, depends} = getFieldType({type: field.map.to} as Field, enumList);

        return {
            type: `['map', '${field.map.from}', ${fieldType}]`,
            depends,
        };
    }

    if (isString(TYPES[type])) {
        return {
            type: `'${type}'`,
            depends: [],
        };
    }

    if (enumList.some(enumItem => enumItem.name === field.type)) {
        return {
            type: '\'enum\'',
            depends: [],
        };
    }

    return {
        type: field.type,
        depends: [field.type],
    };
};
