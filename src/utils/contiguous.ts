const valid = [-9, -1, 1, 9];
const validDiagonal = [...valid, -10, -8, 8, 10];

export const isContiguous = (
    [...cells]: number[],
    allowDiagonals = false
): boolean => {
    if (cells.length === 0) return false;
    let prev = cells.shift()!;
    const check = allowDiagonals ? validDiagonal : valid;
    for (let cell of cells) {
        const diff = cell - prev;

        if (!check.includes(diff)) return false;

        prev = cell;
    }
    return true;
};
