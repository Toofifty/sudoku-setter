import { CandidateError, DigitError, PlayerCell, PuzzleCell } from 'types';
import { runAutomations } from 'utils/automations';
import {
    findSudokuCandidateErrors,
    findSudokuDigitErrors,
} from 'utils/error-checker';

import { GetAction, _, action, merge } from './merge';
import { redoHistory, saveHistory, undoHistory } from './history';
import { load, persist } from './persist';

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
     * Replace pencil mark pairs with centre pairs/tuples
     * when writing the nth pencil mark value into
     * the same n cells
     */
    autoTuples: boolean;
    /**
     * Replace the final Snyder pencil mark in a region
     * with the value
     */
    autoWriteSnyder: boolean;
    /**
     * Replace the final centre mark in a cell with
     * the value
     */
    autoWriteSets: boolean;
    /**
     * Highlight digits that don't match the solution
     */
    showIncorrectMoves: boolean;
    /**
     * Highlight all digits that have broken a restriction
     */
    showInvalidMoves: boolean;
    /**
     * Highlight all marks that have broken a restriction
     */
    showInvalidMarks: boolean;
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
    errors: {
        digit: DigitError[];
        candidate: CandidateError[];
    };
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
    history: { items: [], current: 0 },
    inputMode: 'digit',
    errors: { digit: [], candidate: [] },
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
            autoTuples: false,
            autoWriteSnyder: false,
            autoWriteSets: false,
            showIncorrectMoves: false,
            showInvalidMoves: true,
            showInvalidMarks: true,
            darkMode: false,
        },
    }),
    ...load(`player.${window.location.hash}`, {
        board: Array(81).fill(null).map(emptyCell),
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
    saveHistory<PlayerState>(...trackHistoryOf),
    persist(`player.${window.location.hash}`, 'board')
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
                commit: (index, cell) =>
                    (mutableBoard[index] = board[index] = cell),
                write: (index, value) =>
                    dispatch({
                        type: 'player/set-cell-value',
                        payload: {
                            selection: [index],
                            value,
                        },
                    }),
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
    saveHistory<PlayerState>(...trackHistoryOf),
    persist(`player.${window.location.hash}`, 'board')
);

const calculateErrors = action(
    _ as PlayerState,
    _ as { givens: PuzzleCell[] },
    'player/calculate-errors',
    (state, { givens }) => {
        const { showIncorrectMoves, showInvalidMarks, showInvalidMoves } =
            state.settings;

        const calcDigits = showIncorrectMoves || showInvalidMoves;
        const calcCandidates =
            showInvalidMarks && (showIncorrectMoves || showInvalidMoves);

        return {
            ...state,
            errors: {
                candidate: calcCandidates
                    ? findSudokuCandidateErrors(givens, state.board)
                    : [],
                digit: calcDigits
                    ? findSudokuDigitErrors(givens, state.board)
                    : [],
            },
        };
    }
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
    },
    saveHistory<PlayerState>(...trackHistoryOf)
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

const reset = action(
    _ as PlayerState,
    _ as undefined,
    'player/reset',
    (state) => ({
        ...state,
        history: { items: [], current: 0 },
        board: Array(81).fill(null).map(emptyCell),
    }),
    persist(`player.${window.location.hash}`, 'board')
);

export type PlayerAction =
    | GetAction<typeof commitBoard>
    | GetAction<typeof setCellValue>
    | GetAction<typeof calculateErrors>
    | GetAction<typeof swapPencilMarks>
    | GetAction<typeof setInputMode>
    | GetAction<typeof cycleInputMode>
    | GetAction<typeof setSettings>
    | GetAction<typeof undo>
    | GetAction<typeof redo>
    | GetAction<typeof reset>;

export default merge<PlayerState>(
    defaultState(),
    commitBoard,
    setCellValue,
    calculateErrors,
    swapPencilMarks,
    setInputMode,
    cycleInputMode,
    setSettings,
    undo,
    redo,
    reset
);
