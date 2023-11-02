import useSelector from 'hooks/use-selector';
import { useMemo } from 'react';
import { createSees } from './sees';
import { PlayerCell, PuzzleCell } from 'types';

const createGetImplicitValue =
    (board: PuzzleCell[], playerBoard: PlayerCell[]) => (index: number) => {
        return board[index]?.value ?? playerBoard[index]?.value ?? 0;
    };

const useHighlightedCells = () => {
    const { selection } = useSelector((state) => state.ui);
    const settings = useSelector((state) => state.player.settings);
    const { board, thermos, killerCages, restrictions } = useSelector(
        (state) => state.puzzle
    );
    const playerBoard = useSelector((state) => state.player.board);

    const sees = useMemo(
        () =>
            createSees({
                thermos,
                killerCages,
                settings: {
                    matchSudokuRestrictions:
                        settings.highlightSudokuRestrictions,
                    matchMiscRestrictions: settings.highlightMiscRestrictions,
                },
                restrictions,
            }),
        [thermos, killerCages, settings, restrictions]
    );

    return useMemo(() => {
        if (selection.length === 0) {
            return { value: 0, cells: [] };
        }

        // if all cells in the selection have the same given,
        // we can still highlight the matching numbers
        const getImplicitValue = createGetImplicitValue(board, playerBoard);
        const implicitValue = getImplicitValue(selection[0]);

        // highlight matching numbers
        const value =
            settings.highlightMatchingNumbers &&
            selection
                .map(getImplicitValue)
                .every((value) => value === implicitValue)
                ? implicitValue
                : 0;

        return {
            value,
            cells: sees(selection).filter(
                (index) => !selection.includes(index)
            ),
        };
    }, [
        selection,
        board,
        playerBoard,
        settings.highlightMatchingNumbers,
        sees,
    ]);
};

export default useHighlightedCells;
