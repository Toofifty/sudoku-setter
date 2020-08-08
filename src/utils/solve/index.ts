// eslint-disable-next-line import/no-webpack-loader-syntax
import SolverWorker from 'worker-loader!./solver.worker';
import { SolutionCell, PuzzleCell } from 'types';
import { encode } from 'utils/url';
import useAction from '../../hooks/use-action';
import useSelector from '../../hooks/use-selector';
import { useEffect, useState } from 'react';
import { InterCell } from './types';

type SolveBoardResponse = {
    type: 'solve-board-response';
    key: number;
    payload: InterCell[];
};

type InvalidateCandidates = {
    type: 'invalidate-candidates';
    key: number;
    payload: { index: number; candidates: number[] };
};

type WorkerEvent = SolveBoardResponse | InvalidateCandidates;

const worker = new SolverWorker();

const defaultInterCell: InterCell = {
    value: undefined,
    index: 0,
    initialMarks: [],
    marks: [],
    given: false,
};

const prepareBoard = (
    board: PuzzleCell[],
    solution: SolutionCell[]
): InterCell[] =>
    board.map((cell, i) => {
        const solutionCell = solution[i];
        return {
            ...defaultInterCell,
            value: cell.value ?? solutionCell.value,
            given: cell.given,
            index: i,
            marks: solutionCell.candidates,
            initialMarks: solutionCell.candidates,
            invalidMarks: solutionCell.invalidCandidates,
            color: solutionCell.color,
        };
    });

const prepareSolutionData = (board: InterCell[]): SolutionCell[] =>
    board.map((cell, i) => ({
        value: cell.value,
        candidates: cell.marks,
        invalidCandidates: cell.invalidMarks ?? [],
        color: cell.color,
    }));

export const useSudokuSolver = () => {
    const sudoku = useSelector((state) => state.puzzle);
    const solver = useSelector((state) => state.solver);
    const setSolution = useAction('solver/set-solution');
    const invalidateCandidates = useAction('solver/invalidate-candidates');
    const [key, setKey] = useState(Math.random());

    // lookahead solver listener
    useEffect(() => {
        const lookaheadListener = ({ data }: { data: WorkerEvent }) => {
            if (data.type === 'invalidate-candidates' && data.key === key) {
                invalidateCandidates([data.payload]);
            }
        };

        worker.addEventListener('message', lookaheadListener);

        return () => {
            worker.removeEventListener('message', lookaheadListener);
        };
    }, [invalidateCandidates, key]);

    useEffect(() => {
        const board = prepareBoard(sudoku.board, solver.solution);
        worker.postMessage({
            type: solver.lookahead
                ? 'start-lookahead-solve'
                : 'stop-lookahead-solve',
            payload: {
                board,
                thermos: sudoku.thermos,
                killerCages: sudoku.killerCages,
                stepSolve: solver.stepSolve,
                algorithms: solver.algorithms,
            },
            key,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solver.lookahead, key]);

    return () => {
        // TODO: move to thunk
        window.location.hash = encode(sudoku);

        const localKey = Math.random();
        // update the key so the lookahead
        // listener will ignore old messages
        setKey(localKey);
        const listener = ({ data }: { data: WorkerEvent }) => {
            if (data.type === 'solve-board-response' && data.key === localKey) {
                setSolution(prepareSolutionData(data.payload));
                worker.removeEventListener('message', listener);
            }
        };

        const board = prepareBoard(sudoku.board, solver.solution);

        worker.addEventListener('message', listener);
        worker.postMessage({
            type: 'solve-board',
            payload: {
                board,
                thermos: sudoku.thermos,
                killerCages: sudoku.killerCages,
                stepSolve: solver.stepSolve,
                algorithms: solver.algorithms,
            },
            key: localKey,
        });
    };
};
