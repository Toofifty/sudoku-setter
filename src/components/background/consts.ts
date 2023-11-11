import { getPosition } from 'utils/sudoku';

export const SCALE = 900;

export const THERMO_BULB_SIZE = 0.625;
export const THERMO_LINE_WIDTH = 0.125;

export const GHOST_THERMO_BULB_SIZE = 0.5;
export const GHOST_THERMO_LINE_WIDTH = 0.0625;

export const getSVGPosition = (index: number) => {
    const position = getPosition(index);
    return {
        // +0.5 centers the graphic in the cell
        x: ((position.x + 0.5) * SCALE) / 9,
        y: ((position.y + 0.5) * SCALE) / 9,
    };
};
