import { PlayerCell } from 'types';
import { _, action, merge, GetAction } from './merge';
import { undoHistory, redoHistory, saveHistory } from './history';
import { load, persist } from './persist';
import { runAutomations } from 'utils/automations';

export type InputMode = 'digit' | 'corner' | 'centre';
const inputModes: InputMode[] = ['digit', 'corner', 'centre'];

type PlayerSettings = {
    /**
     * Input mode to use when more than one cell is
     * highlighted
     */
    multiInputMode: Exclude<InputMode, 'digit'>;
    /**
     * Whether tab can also be used to switch input mode.
     * The space bar can always be used.
     */
    tabSwitchesInputMode: boolean;
    /**
     * Whether Q can be used to swap corner -> centre marks (and vice versa)
     * of the current selection
     */
    qSwapsPencilMarks: boolean;
    highlightSelection: boolean;
    outlineSelection: boolean;
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
     * Replace pencil mark pairs with centre pairs
     * when writing the second pencil mark value into
     * the same two cells
     */
    autoPairs: boolean;
    /**
     * Replace the final Snyder pencil mark in a region
     * with the value
     */
    autoWriteSnyder: boolean;
    /**
     * Highlight digits that don't match the solution
     */
    showIncorrectMoves: boolean;
    /**
     * Highlight all digits that have broken a restriction
     */
    showInvalidMoves: boolean;
    /**
     * Interface light/dark mode
     */
    darkMode: boolean;
    /**
     * Interface theme (TODO)
     */
    // theme: string;
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
    ...load('player.settings', {
        settings: {
            multiInputMode: 'corner',
            tabSwitchesInputMode: false,
            qSwapsPencilMarks: false,
            highlightSelection: false,
            outlineSelection: true,
            highlightSudokuRestrictions: true,
            highlightMiscRestrictions: true,
            highlightMatchingNumbers: true,
            autoFixPencilMarks: false,
            autoPairs: false,
            autoWriteSnyder: false,
            showIncorrectMoves: false,
            showInvalidMoves: true,
            darkMode: false,
        },
    }),
});

// action intended to allow automations
// to commit changes to the board that are
// separately tracked in history to the move
// that triggered them
const commitBoard = action(
    _ as PlayerState,
    _ as PlayerCell[],
    'player/commit-board',
    (state, board) => {
        return { ...state, board: [...board] };
    },
    saveHistory<PlayerState>(...trackHistoryOf)
);

const setCellValue = action(
    _ as PlayerState,
    _ as { selection: number[]; value?: number },
    'player/set-cell-value',
    (state, { selection, value }, dispatch) => {
        if (selection.length === 0) {
            return state;
        }
        const board = [...state.board];
        let mode = state.inputMode;
        if (selection.length > 1 && mode === 'digit') {
            mode = state.settings.multiInputMode;
        }
        selection.forEach((index) => {
            const {
                color,
                centreMarks,
                cornerMarks,
                value: initialValue,
            } = board[index];

            // don't overwrite existing digits with pencil marks
            if (initialValue && mode !== 'digit') return;

            if (value === undefined) {
                // delete
                board[index] = {
                    value,
                    color,
                    centreMarks: [],
                    cornerMarks: [],
                };
            } else if (mode === 'digit') {
                // place digit
                board[index] = {
                    value,
                    color,
                    centreMarks: [],
                    cornerMarks: [],
                };
            } else {
                // add/remove marks
                let marks =
                    mode === 'centre' ? [...centreMarks] : [...cornerMarks];
                if (marks.includes(value)) {
                    marks = marks.filter((n) => n !== value);
                } else {
                    marks = [...marks, value].sort();
                }
                board[index] = {
                    color,
                    centreMarks: mode === 'centre' ? marks : centreMarks,
                    cornerMarks: mode === 'corner' ? marks : cornerMarks,
                };
            }
        });

        const mutableBoard = [...board];
        runAutomations(
            state.settings,
            {
                get: (index) => mutableBoard[index],
                set: (index, cell) => (mutableBoard[index] = cell),
                commit: (index, cell) => (board[index] = cell),
                flush: () =>
                    dispatch({
                        type: 'player/commit-board',
                        payload: mutableBoard,
                    }),
            },
            { selection, value, mode }
        );
        return { ...state, board };
    },
    saveHistory<PlayerState>(...trackHistoryOf)
);

const swapPencilMarks = action(
    _ as PlayerState,
    _ as number[],
    'player/swap-pencil-marks',
    (state, selection) => {
        const board = [...state.board];
        selection.forEach((index) => {
            board[index] = {
                ...board[index],
                centreMarks: [...board[index].cornerMarks],
                cornerMarks: [...board[index].centreMarks],
            };
        });
        return { ...state, board };
    }
);

const setInputMode = action(
    _ as PlayerState,
    _ as InputMode,
    'player/set-input-mode',
    (state, inputMode) => ({ ...state, inputMode })
);

const cycleInputMode = action(
    _ as PlayerState,
    _ as boolean,
    'player/cycle-input-mode',
    (state, backwards) => {
        const d = backwards ? -1 : 1;
        const imIndex = inputModes.indexOf(state.inputMode);
        const inputMode = inputModes[(imIndex + d) % inputModes.length];
        return { ...state, inputMode };
    }
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
    | GetAction<typeof commitBoard>
    | GetAction<typeof setCellValue>
    | GetAction<typeof swapPencilMarks>
    | GetAction<typeof setInputMode>
    | GetAction<typeof cycleInputMode>
    | GetAction<typeof setSettings>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<PlayerState>(
    defaultState(),
    commitBoard,
    setCellValue,
    swapPencilMarks,
    setInputMode,
    cycleInputMode,
    setSettings,
    undo,
    redo
);
