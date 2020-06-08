import { Position } from '../types';

export const getBox = (cell: Position): Position => ({
    x: cell.x % 3,
    y: cell.y % 3,
});

export const getBoxIndex = (cell: Position): number => {
    const box = getBox(cell);
    return box.x + box.y * 3;
};

export const getCellAt = (index: number): Position => {
    const y = Math.floor(index / 9);
    const x = index - y * 9;
    return { x, y };
};
