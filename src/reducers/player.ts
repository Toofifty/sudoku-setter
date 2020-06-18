import { PlayerCell } from 'types';
import { _, action, merge, GetAction } from './merge';
import { undoHistory, redoHistory, saveHistory } from './history';

export interface PlayerState {
    board: PlayerCell[];
    inputMode: 'digit' | 'corner' | 'centre';
    history: { items: Omit<PlayerState, 'history'>[]; current: number };
}

const trackHistoryOf: (keyof Omit<PlayerState, 'history'>)[] = ['board'];

const emptyCell = (): PlayerCell => ({
    cornerMarks: [],
    centreMarks: [],
    color: 'white',
});

const defaultState = (): PlayerState => ({
    board: Array(81).fill(null).map(emptyCell),
    history: { items: [], current: 0 },
    inputMode: 'digit',
});

const setCellValue = action(
    _ as PlayerState,
    _ as { index: number; value?: number },
    'player/set-cell-value',
    (state, { index, value }) => {
        let board = [...state.board];
        board[index] = {
            value,
            color: board[index].color,
            centreMarks: [],
            cornerMarks: [],
        };
        return { ...state, board };
    },
    saveHistory<PlayerState>(...trackHistoryOf)
);

const undo = action(
    _ as PlayerState,
    _ as undefined,
    'player/undo',
    undoHistory(...trackHistoryOf)
);

const redo = action(
    _ as PlayerState,
    _ as undefined,
    'player/redo',
    redoHistory(...trackHistoryOf)
);

export type PlayerAction =
    | GetAction<typeof setCellValue>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<PlayerState>(defaultState(), setCellValue, undo, redo);
