import { PlayerCell } from 'types';
import { _, action, merge, GetAction } from './merge';
import { undoHistory, redoHistory, saveHistory } from './history';
import { load, persist } from './persist';
import { getCellAt } from 'utils/sudoku';
import { regionIndices } from 'utils/solve/helper';

type InputMode = 'digit' | 'corner' | 'centre';
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
            highlightSudokuRestrictions: true,
            highlightMiscRestrictions: true,
            highlightMatchingNumbers: true,
            autoFixPencilMarks: false,
            showIncorrectMoves: false,
            showInvalidMoves: true,
            darkMode: false,
        },
    }),
});

const setCellValue = action(
    _ as PlayerState,
    _ as { index: number; value?: number }[],
    'player/set-cell-value',
    (state, cells) => {
        let board = [...state.board];
        let mode = state.inputMode;
        if (cells.length > 1 && mode === 'digit') {
            mode = state.settings.multiInputMode;
        }
        cells.forEach(({ index, value }) => {
            const {
                color,
                centreMarks,
                cornerMarks,
                value: initialValue,
            } = board[index];

            console.log(initialValue);

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
                if (state.settings.autoFixPencilMarks) {
                    regionIndices(getCellAt(index))
                        .flat()
                        .forEach((affectedIndex) => {
                            board[affectedIndex] = {
                                ...board[affectedIndex],
                                centreMarks: board[
                                    affectedIndex
                                ].centreMarks.filter((m) => m !== value),
                                cornerMarks: board[
                                    affectedIndex
                                ].cornerMarks.filter((m) => m !== value),
                            };
                        });
                }
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

export type PlayerAction =
    | GetAction<typeof setCellValue>
    | GetAction<typeof setInputMode>
    | GetAction<typeof cycleInputMode>
    | GetAction<typeof setSettings>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<PlayerState>(
    defaultState(),
    setCellValue,
    setInputMode,
    cycleInputMode,
    setSettings,
    undo,
    redo
);
