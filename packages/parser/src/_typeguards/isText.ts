export function isText(value: unknown): value is string {
    return typeof value === 'string' && value !== '';
}
