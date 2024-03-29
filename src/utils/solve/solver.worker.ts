import { InterCell, SolvePayload } from './types';
import {
    solveAntiKing,
    solveAntiKnight,
    solveArrows,
    solveHiddenPairs,
    solveHiddenSingles,
    solveKillerCages,
    solveLockedCandidates,
    solveNakedPairs,
    solveNakedSingles,
    solveNakedTuples,
    solveNonSeqNeighbors,
    solveThermos,
    solveXWing,
    solveYWing,
} from './solvers';
import { hasEmptyCell, isFilled } from './helper';
import { solveUniqueDiagonals } from './solvers/unique-diagonals';
import { SolveHistory, print } from './solvers/history';

type SolveBoard = { type: 'solve-board'; key: number; payload: SolvePayload };

type StartLookaheadSolve = {
    type: 'start-lookahead-solve';
    // key is used to stop old solves from
    // continuing
    key: number;
    payload: SolvePayload;
};

type StopLookaheadSolve = { type: 'stop-lookahead-solve'; payload: undefined };

type WorkerEvent = SolveBoard | StartLookaheadSolve | StopLookaheadSolve;

// use an object - so it won't get caught
// in a closure and can be checked at anytime
const lookaheadSolve = { enabled: false, key: 0 };

const defaultInterCell: InterCell = {
    value: undefined,
    index: 0,
    initialMarks: [],
    marks: [],
    given: false,
};

const SOLVE_PASSES = 20;

const noop = (a: any) => a;

const solveStep = ({
    board,
    thermos,
    arrows,
    killerCages,
    algorithms,
}: SolvePayload) => {
    let hasChanged = false;
    // console.time('solve step');

    const history: SolveHistory = [];

    // prepare cells
    let intermediate: InterCell[] = board.map((cell, i) => ({
        ...defaultInterCell,
        ...cell,
        marks: isFilled(cell) ? [cell.value] : cell.marks,
        initialMarks: isFilled(cell) ? [cell.value] : cell.marks,
        index: i,
    }));

    intermediate = intermediate
        .map(solveNakedSingles)
        .map(algorithms.hiddenSingles ? solveHiddenSingles(history) : noop)
        .map(algorithms.nakedPairs ? solveNakedPairs(history) : noop)
        .map(algorithms.hiddenPairs ? solveHiddenPairs : noop)
        .map(algorithms.nakedTuples ? solveNakedTuples : noop)
        .map(algorithms.lockedCandidates ? solveLockedCandidates : noop)
        .map(algorithms.yWing ? solveYWing(history) : noop)
        .map(algorithms.xWing ? solveXWing(history) : noop);

    // solve particular sudokus
    if (thermos && algorithms.thermos) {
        intermediate = intermediate.map(solveThermos(thermos));
    }

    if (arrows && algorithms.arrows) {
        intermediate = intermediate.map(solveArrows(history, arrows));
    }

    if (killerCages && algorithms.killerCages) {
        intermediate = intermediate.map(solveKillerCages(killerCages));
    }

    if (algorithms.antiKing) {
        intermediate = intermediate.map(solveAntiKing);
    }

    if (algorithms.antiKnight) {
        intermediate = intermediate.map(solveAntiKnight);
    }

    if (algorithms.nonSeqNeighbors) {
        intermediate = intermediate.map(solveNonSeqNeighbors);
    }

    if (algorithms.uniqueDiagonals) {
        intermediate = intermediate.map(solveUniqueDiagonals);
    }

    // final cleanup & check for changes
    intermediate = intermediate.map(solveNakedSingles).map((cell, i) => {
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
            // don't double up on history if another algorithm
            // has already placed this value
            if (
                !history.some(
                    (step) =>
                        step.affected.length === 1 && step.affected[0] === i
                )
            ) {
                history.push({
                    algorithm: 'naked-singles',
                    affected: [i],
                    digit: cell.marks[0],
                });
            }

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

    // console.timeEnd('solve step');
    print(history);
    return {
        updatedBoard: intermediate,
        hasChanged,
    };
};

const solveBoard = (sudoku: SolvePayload) => {
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

const runLookaheadSolve = (sudoku: SolvePayload, key: number) => {
    console.time('lookahead solve');

    sudoku.board.forEach((cell, i) => {
        if (
            isFilled(cell) ||
            !lookaheadSolve.enabled ||
            lookaheadSolve.key !== key
        )
            return;

        const invalid = [];
        for (const n of cell.marks.filter(
            (n) => !cell.invalidMarks?.includes(n)
        )) {
            if (!lookaheadSolve.enabled || lookaheadSolve.key !== key) continue;

            const testBoard: InterCell[] = JSON.parse(
                JSON.stringify(sudoku.board)
            );
            testBoard[i] = {
                value: n,
                given: false,
                marks: [n],
                initialMarks: [n],
                index: i,
            };
            const solved = solveBoard({ ...sudoku, board: testBoard });

            if (hasEmptyCell(solved)) {
                // update marks to make future lookaheads smarter
                cell.marks = cell.marks.filter((m) => m !== n);
                invalid.push(n);
            }
        }

        postMessage({
            type: 'invalidate-candidates',
            payload: { index: i, candidates: invalid },
            key,
        });
    });

    console.timeEnd('lookahead solve');
};

/* eslint-disable no-restricted-globals */
addEventListener('message', ({ data }: { data: WorkerEvent }) => {
    switch (data.type) {
        case 'solve-board': {
            const updatedBoard = solveBoard(data.payload);
            postMessage({
                type: 'solve-board-response',
                payload: updatedBoard,
                key: data.key,
            });
            if (lookaheadSolve.enabled) {
                lookaheadSolve.key = data.key;
                runLookaheadSolve(
                    { ...data.payload, board: updatedBoard },
                    data.key
                );
            }
            return;
        }
        case 'start-lookahead-solve':
            if (!lookaheadSolve.enabled) {
                lookaheadSolve.enabled = true;
                lookaheadSolve.key = data.key;
                runLookaheadSolve(data.payload, data.key);
            }
            return;
        case 'stop-lookahead-solve':
            lookaheadSolve.enabled = false;
            return;
        default:
            postMessage({ type: 'noop' });
    }
});
