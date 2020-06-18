import { PlayerCell } from 'types';
import { _, action, merge, GetAction } from './merge';
import { undoHistory, redoHistory, saveHistory } from './history';
import { load, persist } from './persist';

type InputMode = 'digit' | 'corner' | 'centre';

type PlayerSettings = {
    /**
     * Input mode to use when more than one cell is
     * highlighted
     */
    multiInputMode: Exclude<InputMode, 'digit'>;
    /**
     * Highlight row/column/box
     */
    highlightSudokuRestrictions: boolean;
    /**
     * Highlight thermos, killer cages etc
     */
    highlightMiscRestrictions: boolean;
    /**
     * Highlight all of n when only n is selected
     */
    highlightMatchingNumbers: boolean;
    /**
     * Remove pencil marks in row/column/box/restriction
     * when a digit is placed
     */
    autoFixPencilMarks: boolean;
    /**
     * Highlight digits that don't match the solution
     */
    showIncorrectMoves: boolean;
    /**
     * Highlight all digits that have broken a restriction
     */
    showInvalidMoves: boolean;
};

export interface PlayerState {
    board: PlayerCell[];
    inputMode: InputMode;
    settings: PlayerSettings;
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
    settings: load('player.settings', {
        multiInputMode: 'corner',
        highlightSudokuRestrictions: true,
        highlightMiscRestrictions: true,
        highlightMatchingNumbers: true,
        autoFixPencilMarks: true,
        showIncorrectMoves: false,
        showInvalidMoves: true,
    }),
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

const setSettings = action(
    _ as PlayerState,
    _ as Partial<PlayerSettings>,
    'player/set-settings',
    (state, settings) => ({
        ...state,
        settings: {
            ...state.settings,
            ...settings,
        },
    }),
    persist('player.settings', 'settings')
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
    | GetAction<typeof setSettings>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<PlayerState>(
    defaultState(),
    setCellValue,
    setSettings,
    undo,
    redo
);
