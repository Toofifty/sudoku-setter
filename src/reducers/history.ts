import { pick } from 'utils';
import { deepEq } from 'utils/misc';

export type WithHistory<TState> = {
    history: { items: Omit<TState, 'history'>[]; current: number };
};

export const saveHistory =
    <TState extends WithHistory<any>>(
        ...keys: (keyof Omit<TState, 'history'>)[]
    ) =>
    (fn: (state: TState, ...args: unknown[]) => TState) =>
    (state: TState, ...args: unknown[]) => {
        // save base state
        const { history: _, ...saveableBaseState } = state;

        const newState = fn(state, ...args);
        const { history, ...saveableState } = newState;
        let items = history?.items ?? [];
        if (history?.current !== items.length - 1) {
            // delete redo history once an action is done
            items = items.slice(0, (history?.current ?? 0) + 1);
        }

        const trackedBaseState = pick(saveableBaseState, keys);
        const trackedState = pick(saveableState, keys);

        // if no change to state, do not add a new history item
        if (deepEq(trackedBaseState, trackedState)) {
            return newState;
        }

        if (items.length === 0) {
            items = [trackedBaseState];
        }

        return {
            ...newState,
            history: {
                items: [...items, trackedState],
                current: (history?.current ?? 0) + 1,
            },
        };
    };

export const undoHistory =
    <TState extends WithHistory<any>>(
        ...keys: (keyof Omit<TState, 'history'>)[]
    ) =>
    (state: TState) => {
        const { history, ...rest } = state;
        const current = (history.current ?? 0) - 1;
        if (!history || current < 0) return state;

        const reverted = pick(history.items[current], keys);

        return {
            ...rest,
            ...reverted,
            history: {
                items: history.items,
                current,
            },
        };
    };

export const redoHistory =
    <TState extends WithHistory<any>>(
        ...keys: (keyof Omit<TState, 'history'>)[]
    ) =>
    (state: TState) => {
        const { history, ...rest } = state;
        const current = (history.current ?? 0) + 1;
        if (!history || current > history.items.length - 1) return state;

        const reverted = pick(history.items[current], keys);

        return {
            ...rest,
            ...reverted,
            history: {
                items: history.items,
                current,
            },
        };
    };
