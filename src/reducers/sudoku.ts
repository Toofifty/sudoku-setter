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
}

const defaultState = (): SudokuState => ({
    board: new Array(81).fill(null).map(emptyCell),
    shouldReduce: false,
});

const posToIndex = (pos: Position) => pos.x + pos.y * 9;

const wipeSolution = (board: ICell[]) => [
    ...board.map((c) => (c.given ? c : emptyCell())),
];

type SetValue = {
    type: 'set-value';
    payload: { cell: Position; value: number; given?: boolean };
};

const setValue = (
    state: SudokuState,
    { cell, value, given }: SetValue['payload']
) => {
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

const clearValue = (state: SudokuState, pos: Position | number) => {
    let board = wipeSolution(state.board);
    board[typeof pos === 'number' ? pos : posToIndex(pos)] = emptyCell();
    return { ...state, board, shouldReduce: true };
};

type SetMarks = {
    type: 'set-marks';
    payload: { cell: Position; marks: number[] };
};

const setMarks = (state: SudokuState, { cell, marks }: SetMarks['payload']) => {
    const board = [...state.board];
    board[posToIndex(cell)] = { marks, given: false };
    return { ...state, board };
};

type SetBoard = {
    type: 'set-board';
    payload: ICell[];
};

const setBoard = (state: SudokuState, board: SetBoard['payload']) => {
    return { ...state, board };
};

type SetShouldReduce = {
    type: 'set-should-reduce';
    payload: boolean;
};

const setShouldReduce = (
    state: SudokuState,
    shouldReduce: SetShouldReduce['payload']
) => ({ ...state, shouldReduce });

type Reset = {
    type: 'reset';
    payload: undefined;
};

const reset = (state: SudokuState) => defaultState();

type CreateThermo = { type: 'create-thermo'; payload: number[] };

const createThermo = (state: SudokuState, thermo: number[]) => ({
    ...state,
    thermos: [...(state.thermos ?? []), thermo],
    shouldReduce: true,
});

type DeleteThermo = { type: 'delete-thermo'; payload: number };

const deleteThermo = (state: SudokuState, cellIndex: number) => ({
    ...state,
    board: wipeSolution(state.board),
    thermos: (state.thermos ?? []).filter(
        (thermo) => !thermo.includes(cellIndex)
    ),
    shouldReduce: true,
});

type SetSudoku = { type: 'set-sudoku'; payload: Partial<SudokuState> };

const setSudoku = (state: SudokuState, sudoku: Partial<SudokuState>) => ({
    ...state,
    ...sudoku,
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
    | DeleteThermo;

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
            return reset(state);
        case 'create-thermo':
            return createThermo(state, action.payload);
        case 'set-sudoku':
            return setSudoku(state, action.payload);
        case 'delete-thermo':
            return deleteThermo(state, action.payload);
        default:
            return state;
    }
};
