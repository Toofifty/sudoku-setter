import { useMemo } from 'react';

import {
    findSudokuCandidateErrors,
    findSudokuDigitErrors,
} from 'utils/error-checker';

import useSelector from './use-selector';

const aggregate = <T extends { index: number }>(list: T[]) =>
    list.reduce((ag, item) => {
        if (!ag[item.index]) {
            ag[item.index] = [];
        }
        ag[item.index].push(item);
        return ag;
    }, {} as Record<number, T[]>);

export const useCellErrors = () => {
    const givens = useSelector((state) => state.puzzle.board);
    const board = useSelector((state) => state.player.board);
    const settings = useSelector((state) => state.player.settings);
    const mode = useSelector((state) => state.puzzle.mode);

    return useMemo(() => {
        if (mode === 'set') {
            return { digitErrors: {}, candidateErrors: {} };
        }
        const { showIncorrectMoves, showInvalidMarks, showInvalidMoves } =
            settings;

        const calcDigits = showIncorrectMoves || showInvalidMoves;
        const calcCandidates =
            showInvalidMarks && (showIncorrectMoves || showInvalidMoves);

        const digitErrors = findSudokuDigitErrors(givens, board);
        const candidateErrors = findSudokuCandidateErrors(givens, board);

        return {
            digitErrors: calcDigits ? aggregate(digitErrors) : {},
            candidateErrors: calcCandidates ? aggregate(candidateErrors) : {},
        };
    }, [givens, board, settings, mode]);
};
