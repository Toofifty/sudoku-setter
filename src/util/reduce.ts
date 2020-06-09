import { ICell, FilledCell, Position } from '../types';
import useAction from '../hooks/use-action';
import useSelector from '../hooks/use-selector';
import { getCellAt, getBoxIndex } from './sudoku';

let doLog = false;

const log = (...m: any) => doLog && console.log(...m);

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type InterCell = {
    value?: number;
    given: boolean;
    pencils: number[];
    initialPencils: number[];
};

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

const except = (arr: number[], n: number) => arr.filter((a) => a !== n);

const getValue = (cell: ICell) => {
    if (isFilled(cell)) return cell.value;
    return 0;
};

const getPencils = (cell: ICell) => {
    if (isFilled(cell)) return [];
    return cell.pencils;
};

const getIndex = (_: any, i: number) => i;

const breaksSudoku = (board: ICell[], pos: Position, n: number) =>
    inColumn(board, pos, n) || inRow(board, pos, n) || inBox(board, pos, n);

const inColumn = (board: ICell[], pos: Position, n: number) => {
    return board
        .filter((_, i) => i % 9 === pos.x)
        .map(getValue)
        .includes(n);
};

const inRow = (board: ICell[], pos: Position, n: number) => {
    return board
        .slice(pos.y * 9, (pos.y + 1) * 9)
        .map(getValue)
        .includes(n);
};

const inBox = (board: ICell[], pos: Position, n: number) => {
    const boxIndex = getBoxIndex(pos);
    return board
        .filter((_, i) => boxIndex === getBoxIndex(getCellAt(i)))
        .map(getValue)
        .includes(n);
};

const isOnlyPlaceFor = (board: ICell[], pos: Position, n: number) =>
    isOnlyPlaceInColumnFor(board, pos, n) ||
    isOnlyPlaceInRowFor(board, pos, n) ||
    isOnlyPlaceInBoxFor(board, pos, n);

const isOnlyPlaceInRowFor = (board: ICell[], pos: Position, n: number) => {
    // if nothing else in the row includes the number,
    // then it must be here
    return board
        .slice(pos.y * 9, (pos.y + 1) * 9)
        .filter((_, i) => i !== pos.x) // filter out self
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));
};

const isOnlyPlaceInColumnFor = (board: ICell[], pos: Position, n: number) => {
    // if nothing else in the column includes the number,
    // then it must be here
    return board
        .filter((_, i) => i % 9 === pos.x)
        .filter((_, i) => i !== pos.y) // filter out self
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));
};

const isOnlyPlaceInBoxFor = (board: ICell[], pos: Position, n: number) => {
    // if nothing else in the column includes the number,
    // then it must be here
    const boxIndex = getBoxIndex(pos);
    return board
        .filter((_, i) => boxIndex === getBoxIndex(getCellAt(i)))
        .filter((_, i) => i !== pos.x + pos.y * 3) // filter out self
        .map(getPencils)
        .every((pencils) => !pencils.includes(n));
};

const isFilled = (cell: any): cell is FilledCell =>
    cell.value && cell.value > 0;
