import {Enum} from '@veksa/protobuf-parser';
import {IEnum, IEnumValue} from "./types";

export const getEnum = (enumItem: Enum): IEnum => {
    const values: IEnumValue[] = Object.entries(enumItem.values).map(([name, data]) => {
        return {
            name,
            value: data.value,
        };
    });

    return {
        name: enumItem.name,
        deprecated: Boolean(enumItem.options.deprecated),
        values,
    };
};
