import { ICell, Position } from '../../types';
import useAction from '../../hooks/use-action';
import useSelector from '../../hooks/use-selector';
import { getCellAt } from '../sudoku';
import { InterCell } from './types';
import { solveGroups } from './solve-groups';
import { column, getValue, row, box, isFilled, getPencils } from './helper';
import { solveNarrowCells } from './solve-narrow-cells';

let doLog = false;

const log = (...m: any) => doLog && console.log(...m);

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const useSudokuReducer = () => {
    const board = useSelector((state) => state.sudoku.board);
    const setBoard = useAction('set-board');

    const reduce = (prev: ICell[]) => {
        let hasChanged = false;
        console.time('reduce');

        // update pencil marks in first pass
        // then all information is pushed through
        // to other passes

        // regular sudoku solver
        // (naked singles)
        let intermediate: InterCell[] = prev.map((cell, i) => {
            const pos = getCellAt(i);

            const pencils =
                isFilled(cell) && cell.given
                    ? []
                    : NUMS.filter((n) => !breaksSudoku(prev, pos, n));

            return {
                ...cell,
                pencils,
                initialPencils: isFilled(cell) ? pencils : cell.pencils,
            };
        });

        // pair/triple/quad solver
        intermediate = solveGroups(intermediate);

        // narrow cell solver (only valid position in row/col/box)
        intermediate = solveNarrowCells(intermediate);

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
            while (hasChanged && tries++ < 20) {
                ({ updatedBoard, hasChanged } = reduce(updatedBoard));
            }

            setBoard(updatedBoard);
        });
    };
};

const breaksSudoku = (board: ICell[], pos: Position, n: number) =>
    inColumn(board, pos, n) || inRow(board, pos, n) || inBox(board, pos, n);

const inColumn = (board: ICell[], pos: Position, n: number) =>
    column(board, pos).map(getValue).includes(n);

const inRow = (board: ICell[], pos: Position, n: number) =>
    row(board, pos).map(getValue).includes(n);

const inBox = (board: ICell[], pos: Position, n: number) =>
    box(board, pos).map(getValue).includes(n);
