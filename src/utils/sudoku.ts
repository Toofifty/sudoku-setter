import { Position } from '../types';

export const getBox = (cell: Position): Position => ({
    x: Math.floor(cell.x / 3),
    y: Math.floor(cell.y / 3),
});

export const getBoxIndex = (cell: Position | number): number => {
    const box = getBox(typeof cell === 'number' ? getPosition(cell) : cell);
    return box.x + box.y * 3;
};

export const getPosition = (index: number): Position => {
    const y = Math.floor(index / 9);
    const x = index - y * 9;
    return { x, y };
};

export const addPosition = (a: Position, b: Position) => {
    return { x: a.x + b.x, y: a.y + b.y };
};

export const multiplyPosition = ({ x, y }: Position, n: number) => {
    return { x: x * n, y: y * n };
};

export const getIndex = ({ x, y }: Position) => {
    if (x < 0 || x >= 9 || y < 0 || y >= 9) {
        return -1;
    }
    return x + y * 9;
};

export const getCoord = (index: number | Position): string => {
    if (typeof index === 'number') {
        return getCoord(getPosition(index)) + `(${index})`;
    }
    return `r${index.y + 1}c${index.x + 1}`;
};

export const isAdjacent = (
    aIndex: number,
    bIndex: number,
    allowDiagonal?: boolean
) => {
    const aPosition = getPosition(aIndex);
    const bPosition = getPosition(bIndex);

    if (allowDiagonal) {
        return (
            Math.abs(aPosition.x - bPosition.x) <= 1 &&
            Math.abs(aPosition.y - bPosition.y) <= 1
        );
    }

    return (
        Math.abs(aPosition.x - bPosition.x) +
            Math.abs(aPosition.y - bPosition.y) ===
        1
    );
};

export const getCellIndex = (pos: Position): number => pos.x + pos.y * 9;
