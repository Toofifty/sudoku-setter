import { ICell, Position, PuzzleCell } from '../types';

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

type CreateThermo = { type: 'create-thermo'; payload: number[] };

const createThermo: Reducer<CreateThermo> = (state, thermo) => ({
    ...state,
    thermos: [...(state.thermos ?? []), thermo],
    shouldSolve: true,
});

type DeleteThermo = { type: 'delete-thermo'; payload: number };

const deleteThermo: Reducer<DeleteThermo> = (state, cellIndex) => ({
    ...state,
    // TODO: wipe solution
    thermos: (state.thermos ?? []).filter(
        (thermo) => !thermo.includes(cellIndex)
    ),
    shouldSolve: true,
});

type CreateKillerCage = {
    type: 'create-killer-cage';
    payload: { total: number; cage: number[] };
};

const createKillerCage: Reducer<CreateKillerCage> = (state, killerCage) => ({
    ...state,
    killerCages: [...(state.killerCages ?? []), killerCage],
    shouldSolve: true,
});

type DeleteKillerCage = { type: 'delete-killer-cage'; payload: number };

const deleteKillerCage: Reducer<DeleteKillerCage> = (state, cellIndex) => ({
    ...state,
    // TODO: wipe solution
    killerCages: (state.killerCages ?? []).filter(
        ({ cage }) => !cage.includes(cellIndex)
    ),
    shouldSolve: true,
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
        case 'create-thermo':
            return createThermo(state, action.payload);
        case 'delete-thermo':
            return deleteThermo(state, action.payload);
        case 'create-killer-cage':
            return createKillerCage(state, action.payload);
        case 'delete-killer-cage':
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
