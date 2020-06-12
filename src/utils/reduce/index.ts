// eslint-disable-next-line import/no-webpack-loader-syntax
import SolverWorker from 'worker-loader!./solver.worker';
import { ICell } from 'types';
import { encode } from 'utils/url';
import useAction from '../../hooks/use-action';
import useSelector from '../../hooks/use-selector';

type SolveBoardResponse = {
    type: 'solve-board-response';
    key: number;
    payload: ICell[];
};

type WorkerEvent = SolveBoardResponse;

const worker = new SolverWorker();

export const useSudokuReducer = () => {
    const sudoku = useSelector((state) => state.sudoku);
    const setBoard = useAction('set-board');

    return () => {
        // TODO: move to thunk
        window.location.hash = encode(sudoku);

        const key = Math.random();
        const listener = ({ data }: { data: WorkerEvent }) => {
            if (data.type === 'solve-board-response' && data.key === key) {
                setBoard(data.payload);
                worker.removeEventListener('message', listener);
            }
        };

        worker.addEventListener('message', listener);
        worker.postMessage({
            type: 'solve-board',
            payload: sudoku,
            key,
        });
    };
};
