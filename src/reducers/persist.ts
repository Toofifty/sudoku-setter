import { pick } from 'utils';

export const load = <T>(storageKey: string, def: T): T => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
        save(storageKey, def);
        return def;
    }
    const data = JSON.parse(stored);
    return { ...def, ...data };
};

export const save = (storageKey: string, data: unknown): void => {
    localStorage.setItem(storageKey, JSON.stringify(data));
};

export const persist = <TState>(
    storageKey: string,
    ...keys: (keyof TState)[]
) => (fn: (state: TState, ...args: unknown[]) => TState) => (
    state: TState,
    ...args: unknown[]
) => {
    const newState = fn(state, ...args);

    save(storageKey, pick(newState, keys));

    return newState;
};
