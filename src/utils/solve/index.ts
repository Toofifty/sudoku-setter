// eslint-disable-next-line import/no-webpack-loader-syntax
import SolverWorker from 'worker-loader!./solver.worker';
import { ICell } from 'types';
import { encode } from 'utils/url';
import useAction from '../../hooks/use-action';
import useSelector from '../../hooks/use-selector';
import { useEffect, useState } from 'react';

type SolveBoardResponse = {
    type: 'solve-board-response';
    key: number;
    payload: ICell[];
};

type InvalidateMarks = {
    type: 'invalidate-marks';
    key: number;
    payload: { index: number; marks: number[] };
};

type WorkerEvent = SolveBoardResponse | InvalidateMarks;

const worker = new SolverWorker();

export const useSudokuSolver = () => {
    const sudoku = useSelector((state) => state.sudoku);
    const setBoard = useAction('set-board');
    const invalidateMarks = useAction('invalidate-marks');
    const [key, setKey] = useState(Math.random());

    // lookahead solver listener
    useEffect(() => {
        const lookaheadListener = ({ data }: { data: WorkerEvent }) => {
            if (data.type === 'invalidate-marks' && data.key === key) {
                invalidateMarks([data.payload]);
            }
        };

        worker.addEventListener('message', lookaheadListener);

        return () => {
            worker.removeEventListener('message', lookaheadListener);
        };
    }, [invalidateMarks, key]);

    useEffect(() => {
        worker.postMessage({
            type: sudoku.lookaheadSolve
                ? 'start-lookahead-solve'
                : 'stop-lookahead-solve',
            payload: sudoku,
            key,
        });
    }, [sudoku.lookaheadSolve, sudoku, key]);

    return () => {
        // TODO: move to thunk
        window.location.hash = encode(sudoku);

        const localKey = Math.random();
        // update the key so the lookahead
        // listener will ignore old messages
        setKey(localKey);
        const listener = ({ data }: { data: WorkerEvent }) => {
            if (data.type === 'solve-board-response' && data.key === localKey) {
                setBoard(data.payload);
                worker.removeEventListener('message', listener);
            }
        };

        worker.addEventListener('message', listener);
        worker.postMessage({
            type: 'solve-board',
            payload: sudoku,
            key: localKey,
        });
    };
};
