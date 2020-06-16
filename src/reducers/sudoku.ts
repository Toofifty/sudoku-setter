import { ICell, PuzzleCell } from '../types';

const emptyCell = () => ({
    given: false,
});

export interface SudokuState {
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

const defaultState = (): SudokuState => ({
    board: Array(81).fill(null).map(emptyCell),
    colors: Array(81).fill('white'),
    restrictions: {
        antiKing: false,
        antiKnight: false,
        uniqueDiagonals: false,
    },
});

type Reducer<T extends { payload: any }> = (
    state: SudokuState,
    payload: T['payload']
) => SudokuState;

type SetGiven = {
    type: 'puzzle/set-given';
    payload: { index: number; value?: number };
};

const setGiven: Reducer<SetGiven> = (state, { index, value }) => {
    let board = [...state.board];
    board[index] = { value, given: true };
    return { ...state, shouldSolve: true, board };
};

type SetBoard = {
    type: 'set-board';
    payload: ICell[];
};

const setBoard: Reducer<SetBoard> = (state, board) => {
    return { ...state, board };
};

type Reset = {
    type: 'puzzle/reset';
    payload: undefined;
};

const reset = () => defaultState();

type CreateThermo = { type: 'puzzle/create-thermo'; payload: number[] };

const createThermo: Reducer<CreateThermo> = (state, thermo) => ({
    ...state,
    thermos: [...(state.thermos ?? []), thermo],
});

type DeleteThermo = { type: 'puzzle/delete-thermo'; payload: number };

const deleteThermo: Reducer<DeleteThermo> = (state, cellIndex) => ({
    ...state,
    thermos: (state.thermos ?? []).filter(
        (thermo) => !thermo.includes(cellIndex)
    ),
});

type CreateKillerCage = {
    type: 'puzzle/create-killer-cage';
    payload: { total: number; cage: number[] };
};

const createKillerCage: Reducer<CreateKillerCage> = (state, killerCage) => ({
    ...state,
    killerCages: [...(state.killerCages ?? []), killerCage],
});

type DeleteKillerCage = { type: 'puzzle/delete-killer-cage'; payload: number };

const deleteKillerCage: Reducer<DeleteKillerCage> = (state, cellIndex) => ({
    ...state,
    killerCages: (state.killerCages ?? []).filter(
        ({ cage }) => !cage.includes(cellIndex)
    ),
});

type SetSudoku = { type: 'set-sudoku'; payload: Partial<SudokuState> };

const setSudoku: Reducer<SetSudoku> = (state, sudoku) => ({
    ...state,
    ...sudoku,
});

type SetColor = {
    type: 'set-color';
    payload: { index: number | number[]; color: string };
};

const setColor: Reducer<SetColor> = (state, { index, color }) => {
    if (typeof index === 'number') index = [index];
    const colors = [...state.colors];
    index.forEach((i) => (colors[i] = color));
    return { ...state, colors };
};

type SetRestrictions = {
    type: 'puzzle/set-restrictions';
    payload: Partial<SudokuState['restrictions']>;
};

const setRestrictions: Reducer<SetRestrictions> = (state, restrictions) => ({
    ...state,
    restrictions: { ...state.restrictions, ...restrictions },
});

export type SudokuAction =
    | SetGiven
    | SetBoard
    | Reset
    | CreateThermo
    | DeleteThermo
    | CreateKillerCage
    | DeleteKillerCage
    | SetSudoku
    | SetColor
    | SetRestrictions;

export default (state = defaultState(), action: SudokuAction) => {
    switch (action.type) {
        case 'puzzle/set-given':
            return setGiven(state, action.payload);
        case 'set-board':
            return setBoard(state, action.payload);
        case 'puzzle/reset':
            return reset();
        case 'puzzle/create-thermo':
            return createThermo(state, action.payload);
        case 'puzzle/delete-thermo':
            return deleteThermo(state, action.payload);
        case 'puzzle/create-killer-cage':
            return createKillerCage(state, action.payload);
        case 'puzzle/delete-killer-cage':
            return deleteKillerCage(state, action.payload);
        case 'set-sudoku':
            return setSudoku(state, action.payload);
        case 'set-color':
            return setColor(state, action.payload);
        case 'puzzle/set-restrictions':
            return setRestrictions(state, action.payload);
        default:
            return state;
    }
};
