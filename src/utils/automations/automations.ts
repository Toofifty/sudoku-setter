import { allBoxIndices, boxIndices, regionIndices } from 'utils/solve/helper';
import { getPosition } from 'utils/sudoku';
import { intersection } from 'utils';
import { range } from 'utils/misc';
import { permutations } from 'utils/permutations';
import { includesAny } from 'utils/array';

import { Automation } from './types';

export const autoFixPencilMarks: Automation = (
    { get, commit },
    { selection, value, mode },
    context
) => {
    if (mode !== 'digit' || !value) return;

    regionIndices(getPosition(selection[0]))
        .flat()
        .forEach((affectedIndex) => {
            const cell = get(affectedIndex);

            if (
                cell.centreMarks.includes(value) ||
                cell.cornerMarks.includes(value)
            ) {
                context.candidatesRemoved.push(affectedIndex);

                commit(affectedIndex, {
                    ...cell,
                    centreMarks: cell.centreMarks.filter((m) => m !== value),
                    cornerMarks: cell.cornerMarks.filter((m) => m !== value),
                });
            }
        });
};

export const autoTuples: Automation = (
    { get, set, flush },
    { selection, value, mode }
) => {
    // skip over any selected cells with values
    selection = selection.filter((index) => !get(index).value);

    if (mode !== 'corner' || !value) {
        return;
    }

    // don't overwrite centre marks
    if (selection.map((index) => get(index).centreMarks).flat().length > 0) {
        return;
    }

    // on placement of a corner mark
    // start with n = 2, try to find n cells that
    // contain n candidates corner or centre marked
    // if found, change all corner marks to centre marks

    let success = false;

    // only test for boxes - this is the simplest
    // it works with all regions, but it can find pairs in rows
    // where there may be other candidates in the box etc.
    const region = boxIndices(getPosition(selection[0]), true);

    // make sure entire selection is within region
    if (!selection.slice(1).every((i) => region.includes(i))) {
        return;
    }

    const regionCells = region.map(get);

    // find all candidates already marked in this region
    const candidatesInRegion = [
        ...new Set(
            regionCells.reduce(
                (candidates, cell) => [
                    ...candidates,
                    ...cell.centreMarks,
                    ...cell.cornerMarks,
                ],
                [] as number[]
            )
        ),
    ];

    // ignore singles
    if (candidatesInRegion.length < 2) {
        return;
    }

    // get all possible permutations of candidates
    const possibleSets = permutations(candidatesInRegion).filter(
        (perm) => perm.length > 1
    );

    // for each permutation, see if there are n cells in the
    // region containing the n candidates
    possibleSets.forEach((candidates) => {
        // find all cells with any of the candidates
        const candidateCells = region.filter((index) => {
            const cell = get(index);
            return (
                includesAny(cell.centreMarks, candidates) ||
                includesAny(cell.cornerMarks, candidates)
            );
        });

        // not n candidates over n cells - not a tuple
        if (candidateCells.length !== candidates.length) {
            return;
        }

        // all cells must have at least 2 of the candidates
        if (
            candidateCells.some((index) => {
                const cell = get(index);
                const matchingCandidates = [
                    ...cell.centreMarks,
                    ...cell.cornerMarks,
                ].filter((c) => candidates.includes(c));
                return matchingCandidates.length < 2;
            })
        ) {
            return;
        }

        // there must be at least 2 cells in the tuple with
        // the current value
        if (
            candidateCells.filter((index) => {
                const cell = get(index);
                return [...cell.cornerMarks, ...cell.centreMarks].includes(
                    value
                );
            }).length < 2
        ) {
            return;
        }

        success = true;
        candidateCells.forEach((index) => {
            const cell = get(index);
            set(index, {
                ...cell,
                cornerMarks: [],
                centreMarks: [...cell.centreMarks, ...cell.cornerMarks].filter(
                    (mark) => candidates.includes(mark)
                ),
            });
        });
    });

    if (success) {
        flush();
    }
};

export const autoWriteSnyder: Automation = (
    { get, write },
    { value },
    context
) => {
    if (!value || context.candidatesRemoved.length === 0) {
        return;
    }

    // check the regions of each cell that has had a candidate
    // removed from an earlier automation
    context.candidatesRemoved.forEach((index) => {
        regionIndices(getPosition(index)).forEach((region) => {
            // find all cells in the region with this candidate
            const candidateLocations = region.filter((i) =>
                get(i).cornerMarks.includes(value)
            );

            // if there is only one cell left with the candidate,
            // write it
            if (candidateLocations.length === 1) {
                write(candidateLocations[0], value);
            }
        });
    });
};

export const autoWriteSets: Automation = (
    { get, write },
    { value },
    context
) => {
    if (!value || context.candidatesRemoved.length === 0) {
        return;
    }

    context.candidatesRemoved.forEach((index) => {
        // if the cells with candidates removed have only one
        // candidate left, then write it
        const cell = get(index);
        if (cell.centreMarks.length === 1 && cell.cornerMarks.length === 0) {
            write(index, cell.centreMarks[0]);
        }
    });
};
