import { ICell, FilledCell, Position } from '../../types';
import useAction from '../../hooks/use-action';
import useSelector from '../../hooks/use-selector';
import { getCellAt, getBoxIndex } from '../sudoku';
import { InterCell } from './types';
import { solveGroups } from './solveGroups';
import { column, getValue, row, box, isFilled, getPencils } from './helper';

let doLog = false;

const log = (...m: any) => doLog && console.log(...m);

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const useSudokuReducer = () => {
    const board = useSelector((state) => state.sudoku.board);
    const setBoard = useAction('set-board');

    const reduce = (prev: ICell[]) => {
        console.log('reducing...');
        let hasChanged = false;
        console.time('reduce');
        // update pencil marks in first pass
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

        intermediate = solveGroups(intermediate);

        // other logic in second pass
        intermediate = intermediate.map((cell, i) => {
            const pos = getCellAt(i);
            doLog = i === 8;
            if (isFilled(cell) && cell.given) return cell;

            const op = isFilled(cell) ? [] : cell.pencils;

            let pencils = [...op];
            op.forEach((n) => {
                if (isOnlyPlaceFor(intermediate, pos, n)) {
                    pencils = [n];
                    return false;
                }
            });

            if (
                pencils.length === 1 &&
                isFilled(cell) &&
                cell.value === pencils[0]
            ) {
                // filled value is still correct
                return cell;
            }

            if (pencils.length === 0 && isFilled(cell)) {
            }

            if (
                JSON.stringify(pencils) === JSON.stringify(cell.initialPencils)
            ) {
                return cell;
            }

            hasChanged = true;

            if (pencils.length === 1) {
                return {
                    ...cell,
                    value: pencils[0],
                    given: false,
                };
            }
            return {
                ...cell,
                value: undefined,
                given: false,
                pencils,
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

const isOnlyPlaceFor = (board: ICell[], pos: Position, n: number) =>
    isOnlyPlaceInColumnFor(board, pos, n) ||
    isOnlyPlaceInRowFor(board, pos, n) ||
    isOnlyPlaceInBoxFor(board, pos, n);

const isOnlyPlaceInRowFor = (board: ICell[], pos: Position, n: number) =>
    row(board, pos)
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));

const isOnlyPlaceInColumnFor = (board: ICell[], pos: Position, n: number) =>
    column(board, pos)
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));

const isOnlyPlaceInBoxFor = (board: ICell[], pos: Position, n: number) =>
    box(board, pos)
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));
