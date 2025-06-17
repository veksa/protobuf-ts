import {getEnum} from './getEnum';
import {Schema} from '@veksa/protobuf-parser';
import {IEnum} from "./types";

export const getEnumList = (schemaList: Schema[]): IEnum[] => {
    return schemaList.flatMap(schema => {
        return schema.enums.map(enumItem => {
            return getEnum(enumItem);
        });
    });
};
