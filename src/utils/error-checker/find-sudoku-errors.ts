import { CellError, PlayerCell, PuzzleCell } from 'types';
import { range } from 'utils';
import { allRegionIndices } from 'utils/solve/helper';

export const findSudokuDigitErrors = (
    givens: PuzzleCell[],
    board: PlayerCell[]
) => {
    const errors: CellError[] = [];

    const digits = givens.map((given, i) => given.value ?? board[i].value);

    allRegionIndices().forEach((region) => {
        const findDigit = (digit: number) =>
            region.filter((index) => digits[index] === digit);

        const digitsInRegion = region
            .map((index) => digits[index])
            .filter((v) => v);

        // if any digits appear more than once, it's an error
        range(1, 9).forEach((value) => {
            if (digitsInRegion.filter((digit) => digit === value).length > 1) {
                const duplicateIndices = findDigit(value);
                duplicateIndices.forEach((cellIndex) => {
                    errors.push({
                        type: 'digit',
                        index: cellIndex,
                        sees: duplicateIndices.filter((i) => i !== cellIndex),
                    });
                });
            }
        });
    });
};

export const findSudokuCandidateErrors = (
    givens: PuzzleCell[],
    board: PlayerCell[]
) => {
    const errors: CellError[] = [];

    const digits = givens.map((given, i) => given.value ?? board[i].value);

    allRegionIndices().forEach((region) => {
        const findDigit = (digit: number) =>
            region.filter((index) => digits[index] === digit);

        const digitsInRegion = region
            .map((index) => digits[index])
            .filter((v) => v);

        // go through all cell candidates, if the digit is already
        // seen then it's an error
        region.forEach((index) => {
            const cell = board[index];
            [...cell.cornerMarks, ...cell.centreMarks].forEach((candidate) => {
                if (digitsInRegion.includes(candidate)) {
                    const duplicateIndices = findDigit(candidate);
                    errors.push({
                        type: 'candidate',
                        index,
                        candidate,
                        sees: duplicateIndices,
                    });
                }
            });
        });
    });

    return errors;
};
