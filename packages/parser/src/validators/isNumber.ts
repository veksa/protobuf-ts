export const isNumber = (str?: unknown): str is number => {
    return !isNaN(Number(str));
};

isNumber.toString = () => 'number';
