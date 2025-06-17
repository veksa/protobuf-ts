type Validator = string | ((item?: string) => boolean);

type CheckConfig = {
    strict?: boolean;
    ignore?: boolean;
    result?: boolean;
};

export const wrap = (rule: Validator | Validator[], config?: CheckConfig) => ({rule, config});
