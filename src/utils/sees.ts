import { intersection } from './array';
import {
    boxIndices,
    columnIndices,
    diagonalIndices,
    kingIndices,
    knightIndices,
    rowIndices,
} from './solve/helper';
import { getCellAt } from './sudoku';
import { KillerCage, Thermo } from './sudoku-types';

interface SeeConfig {
    thermos: Thermo[];
    killerCages: KillerCage[];
    settings: {
        matchSudokuRestrictions: boolean;
        matchMiscRestrictions: boolean;
    };
    restrictions: {
        antiKing: boolean;
        antiKnight: boolean;
        uniqueDiagonals: boolean;
    };
}

/**
 * Get all the cells that the cell at this index can "see" (is affected by),
 * using all restrictions and variations applied
 */
export const createSees = ({
    thermos,
    killerCages,
    settings,
    restrictions,
}: SeeConfig) => {
    const seesSingle = (index: number): number[] => {
        const pos = getCellAt(index);
        const seen = new Set<number>();
        const add = (i: number) => seen.add(i);
        if (settings.matchSudokuRestrictions) {
            rowIndices(pos).forEach(add);
            columnIndices(pos).forEach(add);
            boxIndices(pos).forEach(add);
        }

        if (settings.matchMiscRestrictions) {
            thermos
                .filter((thermo) => thermo.includes(index))
                .forEach((set) => set.forEach(add));
            killerCages
                .map(({ cage }) => cage)
                .filter((cage) => cage.includes(index))
                .forEach((set) => set.forEach(add));
            if (restrictions.antiKing) {
                kingIndices(pos).forEach(add);
            }
            if (restrictions.antiKnight) {
                knightIndices(pos).forEach(add);
            }
            if (restrictions.uniqueDiagonals) {
                diagonalIndices(pos).flat().forEach(add);
            }
        }

        return Array.from(seen);
    };

    const sees = (index: number | number[]): number[] => {
        if (Array.isArray(index) && index.length === 1) {
            index = index[0];
        }
        if (typeof index === 'number') {
            return seesSingle(index);
        }
        return intersection(...index.map(seesSingle));
    };
    return sees;
};
