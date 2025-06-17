export const cut = <T>(arr: T[], count: number) => arr.splice(0, count);

export const cutStr = (str?: string) => str?.slice(1, -1) ?? '';

export const cutSemicolon = (tokens: string[]) => {
    if (tokens[0] === ';') {
        tokens.shift();
    }
};
