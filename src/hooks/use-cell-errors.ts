import { useMemo } from 'react';

import useSelector from './use-selector';

export const useCellErrors = (cellIndex: number) => {
    const { digit, candidate } = useSelector((state) => state.player.errors);

    return {
        digit: useMemo(
            () => digit.filter((error) => error.index === cellIndex),
            [cellIndex, digit]
        ),
        candidate: useMemo(
            () => candidate.filter((error) => error.index === cellIndex),
            [cellIndex, candidate]
        ),
    };
};
