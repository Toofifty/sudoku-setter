import { ICell, Position, FilledCell } from '../../types';
import { getBoxIndex, getCellAt, getCellIndex } from '../sudoku';

export const row = <T>(board: T[], pos: Position, includeSelf = false) => {
    const row = board.slice(pos.y * 9, (pos.y + 1) * 9);
    if (!includeSelf) return row.filter((_, i) => i !== pos.x);
    return row;
};

export const column = <T>(board: T[], pos: Position, includeSelf = false) => {
    const column = board.filter((_, i) => i % 9 === pos.x);
    if (!includeSelf) return column.filter((_, i) => i !== pos.y);
    return column;
};

export const box = <T>(board: T[], pos: Position, includeSelf = false) => {
    const boxIndex = getBoxIndex(pos);
    const box = board.filter((_, i) => boxIndex === getBoxIndex(getCellAt(i)));
    if (!includeSelf)
        return box.filter((_, i) => i !== (pos.x % 3) + (pos.y % 3) * 3);
    return box;
};

export const king = <T>(board: T[], pos: Position) => {
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
        .map((p) => board[getCellIndex(p)]);
};

export const knight = <T>(board: T[], pos: Position) => {
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
        .map((p) => board[getCellIndex(p)]);
};

export const diagonals = <T>(board: T[], pos: Position) => {
    const diagonals = [];
    if (pos.x === pos.y) {
        diagonals.push(
            board.filter((_, i) => {
                const { x, y } = getCellAt(i);
                return x === y;
            })
        );
    }
    if (pos.x + pos.y === 8) {
        diagonals.push(
            board.filter((_, i) => {
                const { x, y } = getCellAt(i);
                return x + y === 8;
            })
        );
    }
    return diagonals;
};

export const getValue = (cell: ICell) => {
    if (isFilled(cell)) return cell.value;
    return 0;
};

export const getMarks = (cell: ICell) => {
    if (isFilled(cell)) return [];
    return cell.marks;
};

export const getIndex = (_: any, i: number) => i;

export const isFilled = (cell: any): cell is FilledCell =>
    cell.value && cell.value > 0;

export const hasEmptyCell = (board: ICell[]) =>
    board.some((cell) => !isFilled(cell) && cell.marks.length === 0);
