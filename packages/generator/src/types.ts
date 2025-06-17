export interface IEnumValue {
    name: string;
    value: number;
}

export interface IEnum {
    name: string;
    deprecated: boolean;
    values: IEnumValue[];
}

export interface IInterfaceField {
    name: string;
    type: string;
    optional: boolean;
    repeated: boolean;
    deprecated: boolean;
    map?: { from: string; to: string };
    default: string | undefined;
    options?: Record<string, string> | undefined;
}

export interface IPayload {
    name: string;
    default: string | undefined;
}

export interface IInterface {
    name: string;
    payload: IPayload | undefined;
    deprecated: boolean;
    fields: IInterfaceField[];
}

export interface IEvent {
    eventName: string;
    responseName: string;
    payload: IPayload;
    deprecated: boolean;
}

export interface IMethod {
    methodName: string;
    requestName: string;
    responseName: string;
    errorResponseName?: string;
    payload: IPayload;
    deprecated: boolean;
}

export interface ICodecMethodField {
    tag: number;
    name: string;
    type: string;
    required: number;
    repeated: boolean;
    depends?: string[];
}

export interface ICodecMethod {
    name: string;
    fields: ICodecMethodField[];
    depends?: string[];
}

export interface IMapItem {
    name: string;
    payload: IPayload;
}
