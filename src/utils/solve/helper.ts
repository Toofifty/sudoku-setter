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
    const index = getCellIndex(pos);
    const deltas = [-10, -9, -8, -1, 1, 8, 9, 10];
    return deltas
        .map((n) => index + n)
        .filter((n) => n >= 0 && n < 81)
        .map((n) => board[n]);
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
