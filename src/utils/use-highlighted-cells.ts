import useSelector from 'hooks/use-selector';
import { useMemo } from 'react';
import { isPlayModeSelector } from './selectors';
import {
    rowIndices,
    columnIndices,
    boxIndices,
    kingIndices,
    knightIndices,
    diagonalIndices,
} from './solve/helper';
import { getCellAt } from './sudoku';

const useHighlightedCells = () => {
    const { selection, focused } = useSelector((state) => state.ui);
    const isPlayMode = useSelector(isPlayModeSelector);
    const settings = useSelector((state) => state.player.settings);
    const { board, thermos, killerCages, restrictions } = useSelector(
        (state) => state.puzzle
    );
    const playerBoard = useSelector((state) => state.player.board);

    return useMemo(() => {
        const targetCell = isPlayMode ? selection[0] : focused;
        if (!targetCell || selection.length !== 1)
            return { value: 0, cells: [] };

        const highlightMap: Record<number, boolean> = {};
        const targetPos = getCellAt(targetCell);

        const highlight = (cells: number[]) => {
            cells.forEach((cell) => {
                highlightMap[cell] = true;
            });
        };

        // highlight matching numbers
        const value = settings.highlightMatchingNumbers
            ? board[targetCell ?? 0]?.value ??
              playerBoard[targetCell ?? 0]?.value ??
              0
            : 0;

        // highlight sudoku
        if (settings.highlightSudokuRestrictions) {
            highlight(rowIndices(targetPos));
            highlight(columnIndices(targetPos));
            highlight(boxIndices(targetPos));
        }

        // highlight restrictions
        if (settings.highlightMiscRestrictions) {
            const thermoCells = thermos
                .filter((thermo) => thermo.includes(targetCell))
                .flat();
            highlight(thermoCells);

            const killerCells = killerCages
                .filter(({ cage }) => cage.includes(targetCell))
                .map(({ cage }) => cage)
                .flat();
            highlight(killerCells);

            if (restrictions.antiKing) highlight(kingIndices(targetPos));
            if (restrictions.antiKnight) highlight(knightIndices(targetPos));
            if (restrictions.uniqueDiagonals)
                highlight(diagonalIndices(targetPos).flat());
        }

        return { value, cells: Object.keys(highlightMap).map(Number) };
    }, [
        isPlayMode,
        selection,
        focused,
        settings,
        board,
        playerBoard,
        thermos,
        killerCages,
        restrictions,
    ]);
};

export default useHighlightedCells;
