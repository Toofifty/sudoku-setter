import { PuzzleCell } from 'types';
import { _, action, merge, GetAction } from './merge';
import { undoHistory, redoHistory, saveHistory } from './history';
import { Arrow, KillerCage, Thermo } from 'utils/sudoku-types';

export type GameMode = 'set' | 'play';

export interface PuzzleState {
    mode: GameMode;
    board: PuzzleCell[];
    thermos: Thermo[];
    arrows: Arrow[];
    killerCages: KillerCage[];
    restrictions: {
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
    };
    history: { items: Omit<PuzzleState, 'history'>[]; current: number };
}

const trackHistoryOf: (keyof Omit<PuzzleState, 'history'>)[] = [
    'board',
    'thermos',
    'arrows',
    'killerCages',
];

const defaultState = (): PuzzleState => ({
    mode: 'play',
    board: Array(81)
        .fill(null)
        .map(() => ({ given: false, color: 'white' })),
    restrictions: {
        antiKing: false,
        antiKnight: false,
        uniqueDiagonals: false,
    },
    thermos: [],
    arrows: [],
    killerCages: [],
    history: { items: [], current: 0 },
});

const setGiven = action(
    _ as PuzzleState,
    _ as { index: number; value?: number },
    'puzzle/set-given',
    (state, { index, value }) => {
        let board = [...state.board];
        board[index] = {
            value,
            given: value !== undefined,
            color: board[index].color,
        };
        return { ...state, board };
    },
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const reset = action(
    _ as PuzzleState,
    _ as undefined,
    'puzzle/reset',
    (state) => ({ ...defaultState(), mode: state.mode })
);

const createThermo = action(
    _ as PuzzleState,
    _ as Thermo,
    'puzzle/create-thermo',
    (state, thermo) => ({
        ...state,
        thermos: [...state.thermos, thermo],
    }),
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const deleteThermo = action(
    _ as PuzzleState,
    _ as number,
    'puzzle/delete-thermo',
    (state, cellIndex) => ({
        ...state,
        thermos: state.thermos.filter((thermo) => !thermo.includes(cellIndex)),
    }),
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const createArrow = action(
    _ as PuzzleState,
    _ as Arrow,
    'puzzle/create-arrow',
    (state, arrow) => ({
        ...state,
        arrows: [...state.arrows, arrow],
    }),
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const deleteArrow = action(
    _ as PuzzleState,
    _ as number,
    'puzzle/delete-arrow',
    (state, cellIndex) => ({
        ...state,
        arrows: state.arrows.filter(
            ({ head, tail }) => ![head, tail].flat().includes(cellIndex)
        ),
    }),
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const createKillerCage = action(
    _ as PuzzleState,
    _ as KillerCage,
    'puzzle/create-killer-cage',
    (state, killerCage) => ({
        ...state,
        killerCages: [...state.killerCages, killerCage],
    }),
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const deleteKillerCage = action(
    _ as PuzzleState,
    _ as number,
    'puzzle/delete-killer-cage',
    (state, cellIndex) => ({
        ...state,
        killerCages: state.killerCages.filter(
            ({ cage }) => !cage.includes(cellIndex)
        ),
    }),
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const setSudoku = action(
    _ as PuzzleState,
    _ as Partial<PuzzleState>,
    'puzzle/set-sudoku',
    (state, sudoku) => ({
        ...state,
        ...sudoku,
    })
);

const setColor = action(
    _ as PuzzleState,
    _ as { index: number | number[]; color: string },
    'puzzle/set-color',
    (state, { index, color }) => {
        if (typeof index === 'number') index = [index];
        const board = JSON.parse(JSON.stringify(state.board));
        index.forEach((i) => (board[i].color = color));
        return { ...state, board };
    },
    saveHistory<PuzzleState>(...trackHistoryOf)
);

const setRestrictions = action(
    _ as PuzzleState,
    _ as Partial<PuzzleState['restrictions']>,
    'puzzle/set-restrictions',
    (state, restrictions) => ({
        ...state,
        restrictions: { ...state.restrictions, ...restrictions },
    })
);

const undo = action(
    _ as PuzzleState,
    _ as undefined,
    'puzzle/undo',
    undoHistory(...trackHistoryOf)
);

const redo = action(
    _ as PuzzleState,
    _ as undefined,
    'puzzle/redo',
    redoHistory(...trackHistoryOf)
);

export type PuzzleAction =
    | GetAction<typeof setGiven>
    | GetAction<typeof reset>
    | GetAction<typeof createThermo>
    | GetAction<typeof deleteThermo>
    | GetAction<typeof createArrow>
    | GetAction<typeof deleteArrow>
    | GetAction<typeof createKillerCage>
    | GetAction<typeof deleteKillerCage>
    | GetAction<typeof setSudoku>
    | GetAction<typeof setColor>
    | GetAction<typeof setRestrictions>
    | GetAction<typeof undo>
    | GetAction<typeof redo>;

export default merge<PuzzleState>(
    defaultState(),
    setGiven,
    reset,
    createThermo,
    deleteThermo,
    createArrow,
    deleteArrow,
    createKillerCage,
    deleteKillerCage,
    setSudoku,
    setColor,
    setRestrictions,
    undo,
    redo
);
