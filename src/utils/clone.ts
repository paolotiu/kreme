export const clone = <T>(items: T[]): T[] =>
    items.map<T>((item) => (Array.isArray(item) ? ((clone(item) as unknown) as T) : item));
