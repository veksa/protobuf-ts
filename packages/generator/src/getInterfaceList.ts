import {getMessageList} from './getMessageList';
import {getInterface} from './getInterface';
import {Schema} from '@veksa/protobuf-parser';
import {IInterface} from "./types";

export const getInterfaceList = (schemaList: Schema[]): IInterface[] => {
    const messageList = getMessageList(schemaList);

    return messageList.map(message => {
        return getInterface(message, messageList);
    });
};
