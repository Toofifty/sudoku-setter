import { ICell, Position } from '../types';
import { isFilled } from 'utils/reduce/helper';

const emptyCell = () => ({
    marks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    given: false,
});

export interface SudokuState {
    board: ICell[];
    thermos?: number[][];
    shouldReduce: boolean;
    colors: string[];
    solvers: {
        hiddenSingles: boolean;
        nakedPairs: boolean;
        hiddenPairs: boolean;
        lockedCandidates: boolean;
        thermos: boolean;
    };
}

const defaultState = (): SudokuState => ({
    board: Array(81).fill(null).map(emptyCell),
    colors: Array(81).fill('white'),
    shouldReduce: false,
    solvers: {
        hiddenSingles: true,
        nakedPairs: true,
        hiddenPairs: true,
        lockedCandidates: true,
        thermos: true,
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
    const target = board[posToIndex(cell)];
    if (isFilled(target) && target.value !== value) board = wipeSolution(board);
    board[posToIndex(cell)] = { value, given: given ?? false };
    return { ...state, shouldReduce: true, board };
};

type ClearValue = {
    type: 'clear-value';
    payload: Position | number;
};

const clearValue: Reducer<ClearValue> = (state, pos) => {
    let board = wipeSolution(state.board);
    board[typeof pos === 'number' ? pos : posToIndex(pos)] = emptyCell();
    return { ...state, board, shouldReduce: true };
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

type SetShouldReduce = {
    type: 'set-should-reduce';
    payload: boolean;
};

const setShouldReduce: Reducer<SetShouldReduce> = (state, shouldReduce) => ({
    ...state,
    shouldReduce,
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
    shouldReduce: true,
});

type DeleteThermo = { type: 'delete-thermo'; payload: number };

const deleteThermo: Reducer<DeleteThermo> = (state, cellIndex) => ({
    ...state,
    board: wipeSolution(state.board),
    thermos: (state.thermos ?? []).filter(
        (thermo) => !thermo.includes(cellIndex)
    ),
    shouldReduce: true,
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

type SetSolvers = {
    type: 'set-solvers';
    payload: Partial<SudokuState['solvers']>;
};

const setSolvers: Reducer<SetSolvers> = (state, solvers) => ({
    ...solveFromScratch(state, undefined),
    solvers: { ...state.solvers, ...solvers },
});

type SolveFromScratch = {
    type: 'solve-from-scratch';
    payload: undefined;
};

const solveFromScratch: Reducer<SolveFromScratch> = (state) => ({
    ...state,
    board: wipeSolution(state.board),
    shouldReduce: true,
});

export type SudokuAction =
    | SetValue
    | SetMarks
    | SetShouldReduce
    | SetBoard
    | ClearValue
    | Reset
    | CreateThermo
    | SetSudoku
    | DeleteThermo
    | SetColor
    | SetSolvers
    | SolveFromScratch;

export default (state = defaultState(), action: SudokuAction) => {
    switch (action.type) {
        case 'set-value':
            return setValue(state, action.payload);
        case 'set-marks':
            return setMarks(state, action.payload);
        case 'set-should-reduce':
            return setShouldReduce(state, action.payload);
        case 'set-board':
            return setBoard(state, action.payload);
        case 'clear-value':
            return clearValue(state, action.payload);
        case 'reset':
            return reset();
        case 'create-thermo':
            return createThermo(state, action.payload);
        case 'set-sudoku':
            return setSudoku(state, action.payload);
        case 'delete-thermo':
            return deleteThermo(state, action.payload);
        case 'set-color':
            return setColor(state, action.payload);
        case 'set-solvers':
            return setSolvers(state, action.payload);
        case 'solve-from-scratch':
            return solveFromScratch(state, action.payload);
        default:
            return state;
    }
};
