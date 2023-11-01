import { Position, FilledCell } from '../../types';
import { getBoxIndex, getCellAt, getCellIndex } from '../sudoku';
import { InterCell } from './types';
import { range } from 'utils/misc';

export const row = <T>(board: T[], pos: Position, includeSelf = false) => {
    const row = board.slice(pos.y * 9, (pos.y + 1) * 9);
    if (!includeSelf) return row.filter((_, i) => i !== pos.x);
    return row;
};

export const rowIndices = (pos: Position, includeSelf = false) => {
    const row = range(pos.y * 9, (pos.y + 1) * 9);
    if (!includeSelf) return row.filter((n) => n !== getCellIndex(pos));
    return row;
};

export const column = <T>(board: T[], pos: Position, includeSelf = false) => {
    const column = board.filter((_, i) => i % 9 === pos.x);
    if (!includeSelf) return column.filter((_, i) => i !== pos.y);
    return column;
};

export const columnIndices = (pos: Position, includeSelf = false) => {
    const column = range(0, 9).map((n) => n * 9 + pos.x);
    if (!includeSelf) return column.filter((n) => n !== getCellIndex(pos));
    return column;
};

export const box = <T>(board: T[], pos: Position, includeSelf = false) => {
    const boxIndex = getBoxIndex(pos);
    const box = board.filter((_, i) => boxIndex === getBoxIndex(getCellAt(i)));
    if (!includeSelf)
        return box.filter((_, i) => i !== (pos.x % 3) + (pos.y % 3) * 3);
    return box;
};

export const boxIndices = (pos: Position, includeSelf = false) => {
    const boxIndex = getBoxIndex(pos);
    const box = range(0, 81).filter((n) => getBoxIndex(n) === boxIndex);
    if (!includeSelf) return box.filter((n) => n !== getCellIndex(pos));
    return box;
};

export const regions = <T>(board: T[], pos: Position, includeSelf = false) => [
    row(board, pos, includeSelf),
    column(board, pos, includeSelf),
    box(board, pos, includeSelf),
];

export const regionIndices = (pos: Position, includeSelf = false) => [
    rowIndices(pos, includeSelf),
    columnIndices(pos, includeSelf),
    boxIndices(pos, includeSelf),
];

export const king = <T>(board: T[], pos: Position) =>
    kingIndices(pos).map((i) => board[i]);

export const kingIndices = (pos: Position) => {
    const deltas = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ];
    return deltas
        .map(([x, y]) => ({ x: pos.x + x, y: pos.y + y }))
        .filter(({ x, y }) => x >= 0 && x < 9 && y >= 0 && y < 9)
        .map(getCellIndex);
};

export const knight = <T>(board: T[], pos: Position) =>
    knightIndices(pos).map((i) => board[i]);

export const knightIndices = (pos: Position) => {
    const deltas = [
        [-1, -2],
        [1, -2],
        [-2, -1],
        [2, -1],
        [-2, 1],
        [2, 1],
        [-1, 2],
        [1, 2],
    ];
    return deltas
        .map(([x, y]) => ({ x: pos.x + x, y: pos.y + y }))
        .filter(({ x, y }) => x >= 0 && x < 9 && y >= 0 && y < 9)
        .map(getCellIndex);
};

export const diagonals = <T>(board: T[], pos: Position) =>
    diagonalIndices(pos).map((diag) => diag.map((i) => board[i]));

export const diagonalIndices = (pos: Position) => {
    const diagonals = [];
    const nums = range(0, 81);
    if (pos.x === pos.y) {
        diagonals.push(
            nums.filter((i) => {
                const { x, y } = getCellAt(i);
                return x === y;
            })
        );
    }
    if (pos.x + pos.y === 8) {
        diagonals.push(
            nums.filter((i) => {
                const { x, y } = getCellAt(i);
                return x + y === 8;
            })
        );
    }
    return diagonals;
};

export const getValue = <T>(cell: T) => {
    if (isFilled(cell)) return cell.value;
    return 0;
};

export const getMarks = (cell: InterCell) => {
    if (isFilled(cell)) return [];
    return cell.marks;
};

export const getIndex = (_: any, i: number) => i;

export const isFilled = (cell: any): cell is FilledCell =>
    cell.value && cell.value > 0;

export const hasEmptyCell = (board: InterCell[]) =>
    board.some((cell) => !isFilled(cell) && cell.marks.length === 0);
