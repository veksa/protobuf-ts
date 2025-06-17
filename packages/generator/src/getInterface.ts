import {Message} from '@veksa/protobuf-parser';
import {IInterface, IInterfaceField} from "./types";
import {TYPES} from "./constants";

export const getInterface = (message: Message, messageList: Message[]): IInterface => {
    const getFieldType = (type: string, map?: {from: string; to: string}) => {
        const baseType = TYPES[type];
        if (baseType) {
            return baseType;
        }

        if (map !== undefined) {
            const isToInterfaceExist = messageList.some(messageItem => {
                return messageItem.name === map.to;
            });

            const fromType = TYPES[map.from]
                ? TYPES[map.from]
                : map.from;

            const toPrimitiveType = TYPES[map.to]
                ? TYPES[map.to]
                : map.to;

            const toType = isToInterfaceExist
                ? `I${map.to}`
                : toPrimitiveType;

            return `Record<${fromType}, ${toType}>`;
        }

        const isInterfaceExist = messageList.some(messageItem => {
            return messageItem.name === type;
        });

        return isInterfaceExist
            ? `I${type}`
            : type;
    };

    const fields: IInterfaceField[] = message.fields.map(field => {
        return {
            name: field.name,
            type: getFieldType(field.type, field.map),
            optional: !field.required,
            repeated: field.repeated,
            deprecated: Boolean(field.options.deprecated),
            default: field.options.default
                ? String(field.options.default)
                : undefined,
            options: (field.options.options as Record<string, string>) ?? undefined,
        };
    });

    const payloadField = fields.find(field => field.name === 'payloadType');

    const payload = payloadField
        ? {
            name: payloadField.type,
            default: payloadField.default,
        }
        : undefined;

    return {
        name: message.name,
        payload,
        deprecated: Boolean(message.options.deprecated),
        fields,
    };
};
