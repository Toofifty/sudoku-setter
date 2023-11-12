import { Position } from 'types';
import { getPosition } from 'utils/sudoku';

export const SCALE = 900;

export const THERMO_BULB_SIZE = 0.75;
export const THERMO_LINE_WIDTH = 0.2;

export const GHOST_THERMO_BULB_SIZE = 0.625;
export const GHOST_THERMO_LINE_WIDTH = 0.1;

export const ARROW_PILL_SIZE = 0.625;
export const ARROW_LINE_WIDTH = 0.0625;
export const ARROW_HEAD_SIZE = 0.15;

export const CAGE_OUTER_PADDING = 0.08;

export const getSVGPosition = (position: number | Position): Position => {
    if (typeof position === 'number') {
        return getSVGPosition(getPosition(position));
    }
    return {
        // +0.5 centers the graphic in the cell
        x: ((position.x + 0.5) * SCALE) / 9,
        y: ((position.y + 0.5) * SCALE) / 9,
    };
};
