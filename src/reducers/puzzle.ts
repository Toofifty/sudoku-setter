import { PuzzleCell } from 'types';
import { _, action, merge, GetAction } from './merge';

export interface PuzzleState {
    board: PuzzleCell[];
    thermos?: number[][];
    killerCages?: { total: number; cage: number[] }[];
    colors: string[];
    restrictions: {
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
    };
}

const defaultState = (): PuzzleState => ({
    board: Array(81)
        .fill(null)
        .map(() => ({ given: false })),
    colors: Array(81).fill('white'),
    restrictions: {
        antiKing: false,
        antiKnight: false,
        uniqueDiagonals: false,
    },
});

const setGiven = action(
    _ as PuzzleState,
    _ as { index: number; value?: number },
    'puzzle/set-given',
    (state, { index, value }) => {
        let board = [...state.board];
        board[index] = { value, given: true };
        return { ...state, shouldSolve: true, board };
    }
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
    })
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
    })
);

const createKillerCage = action(
    _ as PuzzleState,
    _ as { total: number; cage: number[] },
    'puzzle/create-killer-cage',
    (state, killerCage) => ({
        ...state,
        killerCages: [...(state.killerCages ?? []), killerCage],
    })
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
    })
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
        const colors = [...state.colors];
        index.forEach((i) => (colors[i] = color));
        return { ...state, colors };
    }
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

export type PuzzleAction =
    | GetAction<typeof setGiven>
    | GetAction<typeof reset>
    | GetAction<typeof createThermo>
    | GetAction<typeof deleteThermo>
    | GetAction<typeof createKillerCage>
    | GetAction<typeof deleteKillerCage>
    | GetAction<typeof setSudoku>
    | GetAction<typeof setColor>
    | GetAction<typeof setRestrictions>;

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
    setRestrictions
);
