import { PuzzleCell } from 'types';
import { _, action, merge, GetAction } from './merge';

type WithHistory<TState> = { history: { items: TState[]; current: number } };

export interface PuzzleState {
    board: PuzzleCell[];
    thermos: number[][];
    killerCages: { total: number; cage: number[] }[];
    restrictions: {
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
    };
    history: { items: Omit<PuzzleState, 'history'>[]; current: number };
}

const defaultState = (): PuzzleState => ({
    board: Array(81)
        .fill(null)
        .map(() => ({ given: false })),
    restrictions: {
        antiKing: false,
        antiKnight: false,
        uniqueDiagonals: false,
    },
    thermos: [],
    killerCages: [],
    history: { items: [], current: 0 },
});

const saveHistory = (
    fn: (state: PuzzleState, ...args: unknown[]) => PuzzleState
) => (state: PuzzleState, ...args: unknown[]) => {
    // save base state
    const { history: _history, ...saveableBaseState } = state;

    const newState = fn(state, ...args);
    const { history, ...saveableState } = newState;
    let items = history?.items ?? [];
    if (history?.current !== items.length - 1) {
        // delete redo history once an action is done
        items = items.slice(0, (history?.current ?? 0) + 1);
    }

    if (items.length === 0) {
        items = [saveableBaseState];
    }

    return {
        ...newState,
        history: {
            items: [...items, saveableState],
            current: (history?.current ?? 0) + 1,
        },
    };
};

const setGiven = action(
    _ as PuzzleState,
    _ as { index: number; value?: number },
    'puzzle/set-given',
    (state, { index, value }) => {
        let board = [...state.board];
        board[index] = { value, given: !!value };
        return { ...state, board };
    },
    saveHistory
);

const reset = action(_ as PuzzleState, _ as undefined, 'puzzle/reset', () =>
    defaultState()
);

const createThermo = action(
    _ as PuzzleState,
    _ as number[],
    'puzzle/create-thermo',
    (state, thermo) => ({
        ...state,
        thermos: [...(state.thermos ?? []), thermo],
    }),
    saveHistory
);

const deleteThermo = action(
    _ as PuzzleState,
    _ as number,
    'puzzle/delete-thermo',
    (state, cellIndex) => ({
        ...state,
        thermos: (state.thermos ?? []).filter(
            (thermo) => !thermo.includes(cellIndex)
        ),
    }),
    saveHistory
);

const createKillerCage = action(
    _ as PuzzleState,
    _ as { total: number; cage: number[] },
    'puzzle/create-killer-cage',
    (state, killerCage) => ({
        ...state,
        killerCages: [...(state.killerCages ?? []), killerCage],
    }),
    saveHistory
);

const deleteKillerCage = action(
    _ as PuzzleState,
    _ as number,
    'puzzle/delete-killer-cage',
    (state, cellIndex) => ({
        ...state,
        killerCages: (state.killerCages ?? []).filter(
            ({ cage }) => !cage.includes(cellIndex)
        ),
    }),
    saveHistory
);

const setSudoku = action(
    _ as PuzzleState,
    _ as Partial<PuzzleState>,
    'puzzle/set-sudoku',
    (state, sudoku) => ({
        ...state,
        ...sudoku,
    })
);

const setColor = action(
    _ as PuzzleState,
    _ as { index: number | number[]; color: string },
    'puzzle/set-color',
    (state, { index, color }) => {
        if (typeof index === 'number') index = [index];
        const board = [...state.board];
        index.forEach((i) => (board[i].color = color));
        return { ...state, board };
    },
    saveHistory
);

const setRestrictions = action(
    _ as PuzzleState,
    _ as Partial<PuzzleState['restrictions']>,
    'puzzle/set-restrictions',
    (state, restrictions) => ({
        ...state,
        restrictions: { ...state.restrictions, ...restrictions },
    })
);

const undo = action(
    _ as PuzzleState,
    _ as undefined,
    'puzzle/undo',
    (state) => {
        const { history, ...rest } = state;
        if (!history || (history.current ?? 0) < 1) return state;

        const current = history.current - 1;
        return {
            ...rest,
            ...history.items[current],
            // don't need to undo restrictions
            restrictions: rest.restrictions,
            history: {
                items: history.items,
                current,
            },
        };
    }
);

const redo = action(
    _ as PuzzleState,
    _ as undefined,
    'puzzle/redo',
    (state) => {
        const { history, ...rest } = state;
        if (!history || (history.current ?? 0) === history.items.length)
            return state;

        const current = history.current + 1;
        return {
            ...rest,
            ...history.items[current],
            // don't need to redo restrictions
            restrictions: rest.restrictions,
            history: {
                items: history.items,
                current,
            },
        };
    }
);

export type PuzzleAction =
    | GetAction<typeof setGiven>
    | GetAction<typeof reset>
    | GetAction<typeof createThermo>
    | GetAction<typeof deleteThermo>
    | GetAction<typeof createKillerCage>
    | GetAction<typeof deleteKillerCage>
    | GetAction<typeof setSudoku>
    | GetAction<typeof setColor>
    | GetAction<typeof setRestrictions>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<PuzzleState>(
    defaultState(),
    setGiven,
    reset,
    createThermo,
    deleteThermo,
    createKillerCage,
    deleteKillerCage,
    setSudoku,
    setColor,
    setRestrictions,
    undo,
    redo
);
