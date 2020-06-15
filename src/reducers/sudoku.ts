import { ICell, Position } from '../types';
import { isFilled } from 'utils/solve/helper';

const emptyCell = () => ({
    marks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    given: false,
});

const emptyInvalidMarks = () =>
    Array(81)
        .fill(null)
        .map(() => []);

export interface SudokuState {
    board: ICell[];
    invalidMarks: number[][];
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
    invalidMarks: emptyInvalidMarks(),
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

const posToIndex = (pos: Position) => pos.x + pos.y * 9;

const wipeSolution = (board: ICell[]) => [
    ...board.map((c) => (c.given ? c : emptyCell())),
];

type SetValue = {
    type: 'set-value';
    payload: { cell: Position; value: number; given?: boolean };
};

const setValue: Reducer<SetValue> = (state, { cell, value, given }) => {
    let board = [...state.board];
    let invalidMarks = state.invalidMarks;
    const target = board[posToIndex(cell)];
    if (isFilled(target) && target.value !== value) {
        board = wipeSolution(board);
        invalidMarks = emptyInvalidMarks();
    }
    board[posToIndex(cell)] = { value, given: given ?? false };
    return { ...state, shouldSolve: true, board, invalidMarks };
};

type ClearValue = {
    type: 'clear-value';
    payload: Position | number;
};

const clearValue: Reducer<ClearValue> = (state, pos) => {
    let board = wipeSolution(state.board);
    board[typeof pos === 'number' ? pos : posToIndex(pos)] = emptyCell();
    return {
        ...state,
        board,
        invalidMarks: emptyInvalidMarks(),
        shouldSolve: true,
    };
};

type SetMarks = {
    type: 'set-marks';
    payload: { cell: Position; marks: number[] };
};

const setMarks: Reducer<SetMarks> = (state, { cell, marks }) => {
    const board = [...state.board];
    board[posToIndex(cell)] = { marks, given: false };
    return { ...state, board };
};

type SetBoard = {
    type: 'set-board';
    payload: ICell[];
};

const setBoard: Reducer<SetBoard> = (state, board) => {
    return { ...state, board };
};

type SetShouldSolve = {
    type: 'set-should-solve';
    payload: boolean;
};

const setShouldSolve: Reducer<SetShouldSolve> = (state, shouldSolve) => ({
    ...state,
    shouldSolve,
});

type Reset = {
    type: 'reset';
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
    board: wipeSolution(state.board),
    invalidMarks: emptyInvalidMarks(),
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
    board: wipeSolution(state.board),
    invalidMarks: emptyInvalidMarks(),
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
    type: 'set-restrictions';
    payload: Partial<SudokuState['restrictions']>;
};

const setRestrictions: Reducer<SetRestrictions> = (state, restrictions) => ({
    // ...solveFromScratch(state, undefined),
    ...state,
    restrictions: { ...state.restrictions, ...restrictions },
    // solvers: {
    //     ...state.solvers,
    //     ...Object.entries(restrictions).reduce((acc, [restriction, value]) => {
    //         if (restriction in state.solvers) {
    //             return { acc, [restriction]: value };
    //         }
    //         return acc;
    //     }, {} as any),
    // },
});

type InvalidateMarks = {
    type: 'invalidate-marks';
    payload: { index: number; marks: number[] }[];
};

const invalidateMarks: Reducer<InvalidateMarks> = (state, invalidMarks) => {
    const newMarks = [...state.invalidMarks];
    invalidMarks.forEach(({ index, marks }) => {
        newMarks[index].push(
            ...marks.filter((n) => !newMarks[index].includes(n))
        );
    });

    return {
        ...state,
        invalidMarks: newMarks,
    };
};

export type SudokuAction =
    | SetValue
    | SetMarks
    | SetShouldSolve
    | SetBoard
    | ClearValue
    | Reset
    | CreateThermo
    | DeleteThermo
    | CreateKillerCage
    | DeleteKillerCage
    | SetSudoku
    | SetColor
    | SetRestrictions
    | InvalidateMarks;

export default (state = defaultState(), action: SudokuAction) => {
    switch (action.type) {
        case 'set-value':
            return setValue(state, action.payload);
        case 'set-marks':
            return setMarks(state, action.payload);
        case 'set-should-solve':
            return setShouldSolve(state, action.payload);
        case 'set-board':
            return setBoard(state, action.payload);
        case 'clear-value':
            return clearValue(state, action.payload);
        case 'reset':
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
        case 'set-restrictions':
            return setRestrictions(state, action.payload);
        case 'invalidate-marks':
            return invalidateMarks(state, action.payload);
        default:
            return state;
    }
};
