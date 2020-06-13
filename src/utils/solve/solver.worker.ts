import { SudokuState } from 'reducers/sudoku';
import { InterCell } from './types';
import {
    solveNakedSingles,
    solveHiddenSingles,
    solveNakedPairs,
    solveHiddenPairs,
    solveLockedCandidates,
    solveThermos,
    solveKillerCages,
    solveAntiKing,
    solveAntiKnight,
    solveNonSeqNeighbors,
} from './solvers';
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

const solveStep = ({ board, thermos, killerCages, solvers }: SudokuState) => {
    let hasChanged = false;
    console.time('solve step');

    // prepare cells
    let intermediate: InterCell[] = board.map((cell, i) => ({
        ...defaultInterCell,
        ...cell,
        marks: isFilled(cell) ? [cell.value] : cell.marks,
        initialMarks: isFilled(cell) ? [cell.value] : cell.marks,
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

    if (killerCages && solvers.killerCages) {
        intermediate = intermediate.map(solveKillerCages(killerCages));
    }

    if (solvers.antiKing) {
        intermediate = intermediate.map(solveAntiKing);
    }

    if (solvers.antiKnight) {
        intermediate = intermediate.map(solveAntiKnight);
    }

    if (solvers.nonSeqNeighbors) {
        intermediate = intermediate.map(solveNonSeqNeighbors);
    }

    // final cleanup & check for changes
    intermediate = intermediate.map(solveNakedSingles(false)).map((cell, i) => {
        if (
            JSON.stringify(cell.marks) === JSON.stringify(cell.initialMarks) ||
            (cell.initialMarks.length === 1 &&
                cell.initialMarks[0] === cell.value)
        ) {
            // no change in marks - avoid
            // toggling
            return cell;
        }

        hasChanged = true;

        if (
            cell.marks.length === 1 &&
            isFilled(cell) &&
            cell.value === cell.marks[0]
        ) {
            // filled value is still correct
            return cell;
        }

        if (cell.marks.length === 1) {
            console.log('set', i, 'to', cell.marks[0]);

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

    console.timeEnd('solve step');
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
    let { updatedBoard, hasChanged } = solveStep(sudoku);
    const maxTries = sudoku.stepSolve ? 1 : SOLVE_PASSES;

    let tries = 0;
    while (hasChanged && ++tries < maxTries) {
        ({ updatedBoard, hasChanged } = solveStep({
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
