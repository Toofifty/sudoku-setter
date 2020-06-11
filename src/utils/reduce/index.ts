import useAction from '../../hooks/use-action';
import useSelector from '../../hooks/use-selector';
import { InterCell } from './types';
import { isFilled } from './helper';
import { encode } from '../url';
import {
    solveNakedSingles,
    solveHiddenSingles,
    solveHiddenPairs,
    solveNakedPairs,
    solveLockedCandidates,
} from './solvers';
import { SudokuState } from 'reducers/sudoku';
import { solveThermos } from './solvers/thermos';

const defaultInterCell: InterCell = {
    value: undefined,
    index: 0,
    initialMarks: [],
    marks: [],
    given: false,
};

const SOLVE_PASSES = 20;

const noop = (a: any) => a;

export const useSudokuReducer = () => {
    const sudoku = useSelector((state) => state.sudoku);
    const setBoard = useAction('set-board');

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
        intermediate = intermediate
            .map(solveNakedSingles(false))
            .map((cell) => {
                if (
                    JSON.stringify(cell.marks) ===
                    JSON.stringify(cell.initialMarks)
                ) {
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

                if (
                    JSON.stringify(cell.marks) ===
                    JSON.stringify(cell.initialMarks)
                ) {
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

    return () => {
        requestAnimationFrame(() => {
            let { updatedBoard, hasChanged } = reduce(sudoku);

            let tries = 0;
            while (hasChanged && ++tries < SOLVE_PASSES) {
                ({ updatedBoard, hasChanged } = reduce({
                    ...sudoku,
                    board: updatedBoard,
                }));
            }

            setBoard(updatedBoard);

            // TODO: move to thunk
            window.location.hash = encode(sudoku);
        });
    };
};
