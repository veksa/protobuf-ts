import {Schema, Message} from '@veksa/protobuf-parser';

export const getMessageList = (schemaList: Schema[]): Message[] => {
    const messageList: Message[] = [];

    schemaList.forEach(schema => {
        schema.messages.forEach(message => {
            messageList.push(message);
            message.messages.forEach(innerMessage => {
                messageList.push(innerMessage);
            });
        });
    });

    return messageList;
};
