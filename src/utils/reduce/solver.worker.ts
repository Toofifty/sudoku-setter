import { SudokuState } from 'reducers/sudoku';
import { InterCell } from './types';
import {
    solveNakedSingles,
    solveHiddenSingles,
    solveNakedPairs,
    solveHiddenPairs,
    solveLockedCandidates,
} from './solvers';
import { solveThermos } from './solvers/thermos';
import { isFilled } from './helper';

type SolveBoard = { type: 'solve-board'; key: number; payload: SudokuState };

type WorkerEvent = SolveBoard;

const defaultInterCell: InterCell = {
    value: undefined,
    index: 0,
    initialMarks: [],
    marks: [],
    given: false,
};

const SOLVE_PASSES = 20;

const noop = (a: any) => a;

const reduce = ({ board, thermos, solvers }: SudokuState) => {
    let hasChanged = false;
    console.time('reduce');

    // prepare cells
    let intermediate: InterCell[] = board.map((cell, i) => ({
        ...defaultInterCell,
        ...cell,
        index: i,
    }));

    intermediate = intermediate
        .map(solveNakedSingles(true))
        .map(solvers.hiddenSingles ? solveHiddenSingles : noop)
        .map(solvers.nakedPairs ? solveNakedPairs : noop)
        .map(solvers.hiddenPairs ? solveHiddenPairs : noop)
        .map(solvers.lockedCandidates ? solveLockedCandidates : noop);

    // solve particular sudokus
    if (thermos && solvers.thermos) {
        intermediate = intermediate.map(solveThermos(thermos));
    }

    // final cleanup & check for changes
    intermediate = intermediate.map(solveNakedSingles(false)).map((cell) => {
        if (JSON.stringify(cell.marks) === JSON.stringify(cell.initialMarks)) {
            // no change in marks - avoid
            // toggling
            return cell;
        }

        if (
            cell.marks.length === 1 &&
            isFilled(cell) &&
            cell.value === cell.marks[0]
        ) {
            // filled value is still correct
            return cell;
        }

        if (JSON.stringify(cell.marks) === JSON.stringify(cell.initialMarks)) {
            // no change in marks - avoid
            // toggling
            return cell;
        }

        hasChanged = true;

        if (cell.marks.length === 1) {
            return {
                ...cell,
                value: cell.marks[0],
                given: false,
            };
        }
        return {
            ...cell,
            value: undefined,
            given: false,
            marks: cell.marks,
        };
    });

    console.timeEnd('reduce');
    return {
        updatedBoard: intermediate.map((cell) =>
            isFilled(cell)
                ? { value: cell.value, given: cell.given }
                : { marks: cell.marks, given: false }
        ),
        hasChanged,
    };
};

const solveBoard = (sudoku: SudokuState) => {
    let { updatedBoard, hasChanged } = reduce(sudoku);

    let tries = 0;
    while (hasChanged && ++tries < SOLVE_PASSES) {
        ({ updatedBoard, hasChanged } = reduce({
            ...sudoku,
            board: updatedBoard,
        }));
    }

    return updatedBoard;
};

/* eslint-disable no-restricted-globals */
addEventListener('message', ({ data }: { data: WorkerEvent }) => {
    switch (data.type) {
        case 'solve-board':
            postMessage({
                type: 'solve-board-response',
                payload: solveBoard(data.payload),
                key: data.key,
            });
            return;
        default:
            postMessage({ type: 'noop' });
    }
});
