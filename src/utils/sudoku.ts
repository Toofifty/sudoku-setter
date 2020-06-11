import { Position } from '../types';

export const getBox = (cell: Position): Position => ({
    x: Math.floor(cell.x / 3),
    y: Math.floor(cell.y / 3),
});

export const getBoxIndex = (cell: Position | number): number => {
    const box = getBox(typeof cell === 'number' ? getCellAt(cell) : cell);
    return box.x + box.y * 3;
};

export const getCellAt = (index: number): Position => {
    const y = Math.floor(index / 9);
    const x = index - y * 9;
    return { x, y };
};
