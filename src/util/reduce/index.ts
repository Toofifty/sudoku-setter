import { ICell } from '../../types';
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

const defaultInterCell: InterCell = {
    value: undefined,
    index: 0,
    initialPencils: [],
    pencils: [],
    given: false,
};

export const useSudokuReducer = () => {
    const board = useSelector((state) => state.sudoku.board);
    const setBoard = useAction('set-board');

    const reduce = (prev: ICell[]) => {
        let hasChanged = false;
        console.time('reduce');

        // prepare cells
        let intermediate: InterCell[] = prev.map((cell, i) => ({
            ...defaultInterCell,
            ...cell,
            index: i,
        }));

        intermediate = intermediate
            .map(solveNakedSingles(true))
            .map(solveHiddenSingles)
            .map(solveNakedPairs)
            .map(solveHiddenPairs)
            .map(solveLockedCandidates)
            .map(solveNakedSingles(false));

        // check for changes
        intermediate = intermediate.map((cell) => {
            if (
                JSON.stringify(cell.pencils) ===
                JSON.stringify(cell.initialPencils)
            ) {
                // no change in pencil marks - avoid
                // toggling
                return cell;
            }

            if (
                cell.pencils.length === 1 &&
                isFilled(cell) &&
                cell.value === cell.pencils[0]
            ) {
                // filled value is still correct
                return cell;
            }

            if (
                JSON.stringify(cell.pencils) ===
                JSON.stringify(cell.initialPencils)
            ) {
                // no change in pencil marks - avoid
                // toggling
                return cell;
            }

            hasChanged = true;

            if (cell.pencils.length === 1) {
                return {
                    ...cell,
                    value: cell.pencils[0],
                    given: false,
                };
            }
            return {
                ...cell,
                value: undefined,
                given: false,
                pencils: cell.pencils,
            };
        });

        console.timeEnd('reduce');
        return {
            updatedBoard: intermediate.map((cell) =>
                isFilled(cell)
                    ? { value: cell.value, given: cell.given }
                    : { pencils: cell.pencils, given: false }
            ),
            hasChanged,
        };
    };

    return () => {
        requestAnimationFrame(() => {
            let { updatedBoard, hasChanged } = reduce(board);

            let tries = 0;
            while (hasChanged && ++tries < 1) {
                ({ updatedBoard, hasChanged } = reduce(updatedBoard));
            }

            setBoard(updatedBoard);
            window.location.hash = encode(board);
        });
    };
};
