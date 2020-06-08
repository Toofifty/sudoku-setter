import { ICell, Position } from '../types';

interface SudokuState {
    board: ICell[];
}

const defaultState = (): SudokuState => ({
    board: new Array(81).fill({
        pencils: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        given: false,
    }),
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
    return { ...state, board };
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

export type SudokuAction = SetValue | SetPencils;

export default (state = defaultState(), action: SudokuAction) => {
    switch (action.type) {
        case 'set-value':
            return setValue(state, action.payload);
        case 'set-pencils':
            return setPencils(state, action.payload);
        default:
            return state;
    }
};
