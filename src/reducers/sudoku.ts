import { ICell, Position } from '../types';

interface SudokuState {
    board: ICell[];
    shouldReduce: boolean;
}

const defaultState = (): SudokuState => ({
    board: new Array(81).fill(null).map(() => ({
        pencils: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        given: false,
    })),
    shouldReduce: false,
});

const posToIndex = (pos: Position) => pos.x + pos.y * 9;

type SetValue = {
    type: 'set-value';
    payload: { cell: Position; value: number; given?: boolean };
};

const setValue = (
    state: SudokuState,
    { cell, value, given }: SetValue['payload']
) => {
    const board = [...state.board];
    board[posToIndex(cell)] = { value, given: given ?? false };
    return { ...state, shouldReduce: true, board };
};

type ClearValue = {
    type: 'clear-value';
    payload: Position;
};

const clearValue = (state: SudokuState, pos: Position) => {
    const board = [...state.board];
    board[posToIndex(pos)] = {
        pencils: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        given: false,
    };
    return { ...state, board, shouldReduce: true };
};

type SetPencils = {
    type: 'set-pencils';
    payload: { cell: Position; pencils: number[] };
};

const setPencils = (
    state: SudokuState,
    { cell, pencils }: SetPencils['payload']
) => {
    const board = [...state.board];
    board[posToIndex(cell)] = { pencils, given: false };
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

export type SudokuAction =
    | SetValue
    | SetPencils
    | SetShouldReduce
    | SetBoard
    | ClearValue
    | Reset;

export default (state = defaultState(), action: SudokuAction) => {
    switch (action.type) {
        case 'set-value':
            return setValue(state, action.payload);
        case 'set-pencils':
            return setPencils(state, action.payload);
        case 'set-should-reduce':
            return setShouldReduce(state, action.payload);
        case 'set-board':
            return setBoard(state, action.payload);
        case 'clear-value':
            return clearValue(state, action.payload);
        case 'reset':
            return reset(state);
        default:
            return state;
    }
};
