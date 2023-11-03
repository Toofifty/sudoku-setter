import { regionIndices } from 'utils/solve/helper';
import { getCellAt } from 'utils/sudoku';
import { intersection } from 'utils/intersection';
import { Automation } from './types';

export const autoFixPencilMarks: Automation = (
    { get, commit, flush },
    { selection, value, mode }
) => {
    if (mode !== 'digit') return;

    regionIndices(getCellAt(selection[0]))
        .flat()
        .forEach((affectedIndex) => {
            const cell = get(affectedIndex);
            commit(affectedIndex, {
                ...cell,
                centreMarks: cell.centreMarks.filter((m) => m !== value),
                cornerMarks: cell.cornerMarks.filter((m) => m !== value),
            });
        });
};

export const autoPairs: Automation = (
    { get, set, flush },
    { selection, value, mode }
) => {
    // skip over any selected cells with values
    selection = selection.filter((index) => !get(index).value);

    if (mode !== 'corner' || selection.length !== 2 || !value) {
        return;
    }

    // don't overwrite centre marks
    if (selection.map((index) => get(index).centreMarks).flat().length > 0) {
        return;
    }

    // get corner marks of n cells selected
    // will already include new value
    const cellSetCornerMarks = selection.map((index) => get(index).cornerMarks);
    const sharedMarks = intersection(...cellSetCornerMarks);

    if (sharedMarks.length !== 2) {
        return;
    }

    let paired = false;
    regionIndices(getCellAt(selection[0]), true).forEach((region) => {
        // if both selections aren't in this region, skip it
        if (selection.some((index) => !region.includes(index))) {
            return;
        }

        // if shared marks are the only instances of those marks in the region
        // === profit
        const isPair = region.every((index) => {
            if (selection.includes(index)) {
                return true;
            }

            const cell = get(index);
            const marks = [...cell.cornerMarks, ...cell.centreMarks];
            return marks.every((mark) => !sharedMarks.includes(mark));
        });

        if (isPair) {
            paired = true;
            selection.forEach((index) => {
                const cell = get(index);
                set(index, {
                    ...cell,
                    cornerMarks: [],
                    centreMarks: [...sharedMarks],
                });
            });
        }
    });

    if (paired) {
        flush();
    }

    // TODO: make this work with N tuples
};

export const autoWriteSnyder: Automation = (
    { get, set },
    { selection, value, mode }
) => {
    if (mode !== 'digit' || !value) {
        return;
    }

    // if only 1 candidate of the current value left (box-by-box)
    // promote it to a value
};
