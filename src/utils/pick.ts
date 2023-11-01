export const pick = <T extends {}, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> =>
    Object.fromEntries(
        Object.entries(obj).filter(([key]) => keys.includes(key as any))
    ) as any;
