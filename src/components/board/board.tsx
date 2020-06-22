import React, { useEffect, useState } from 'react';
import useSelector from '../../hooks/use-selector';
import { PuzzleCell, SolutionCell, PlayerCell } from '../../types';
import { getBoxIndex, getCellAt } from '../../utils/sudoku';
import Box from '../box';
import Cell from '../cell';
import useAction from '../../hooks/use-action';
import { isEventOver } from 'utils';
import { useSudokuSolver } from '../../utils/solve';
import {
    row,
    column,
    box,
    king,
    knight,
    diagonals,
} from '../../utils/solve/helper';
import KillerCageModal from 'components/killer-cage-modal';
import './board.scss';
import { isSetModeSelector } from 'utils/selectors';

const Board = () => {
    const { board, thermos, killerCages, restrictions } = useSelector(
        (state) => state.puzzle
    );
    const isSetMode = useSelector(isSetModeSelector);
    const { dirty, solution } = useSelector((state) => state.solver);
    const { board: playerBoard } = useSelector((state) => state.player);
    const { selection, focused } = useSelector((state) => state.ui);
    const setSolved = useAction('solver/set-solved');
    const solve = useSudokuSolver();

    const [killerCageModalOpen, setKillerCageModalOpen] = useState(false);

    const setFocus = useAction('ui/set-focus');
    const clearFocus = useAction('ui/clear-focus');

    useEffect(() => {
        if (dirty) {
            solve();
            setSolved();
        }
    }, [dirty, setSolved, solve]);

    // remove selection on click-away
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!isEventOver(e, 'board', 'menu', 'modal')) {
                clearFocus();
            }
        };

        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('click', onClick);
        };
    }, [clearFocus]);

    const boxes = board.reduce(
        (boxes, cell, i) => {
            const pos = getCellAt(i);
            const index = getBoxIndex(pos);
            if (!boxes[index]) {
                boxes[index] = [];
            }
            boxes[index].push({
                cell,
                solutionCell: isSetMode ? solution[i] : undefined,
                playerCell: playerBoard[i],
                index: i,
            });
            return boxes;
        },
        [[], [], [], [], [], [], [], [], []] as {
            cell: PuzzleCell;
            solutionCell?: SolutionCell;
            playerCell?: PlayerCell;
            index: number;
        }[][]
    );

    const highlightedRow =
        focused !== undefined ? row(board, getCellAt(focused)) : [];

    const highlightedColumn =
        focused !== undefined ? column(board, getCellAt(focused)) : [];

    const highlightedBox =
        focused !== undefined ? box(board, getCellAt(focused)) : [];

    const highlightedThermos =
        focused !== undefined && thermos
            ? thermos.filter((thermo) => thermo.includes(focused)).flat()
            : [];

    const highlightedKillerCages =
        focused !== undefined && killerCages
            ? killerCages
                  .filter(({ cage }) => cage.includes(focused))
                  .map(({ cage }) => cage)
                  .flat()
            : [];

    const highlightedKingCells =
        focused !== undefined && restrictions.antiKing
            ? king(board, getCellAt(focused))
            : [];

    const highlightedKnightCells =
        focused !== undefined && restrictions.antiKnight
            ? knight(board, getCellAt(focused))
            : [];

    const highlightedDiagonals =
        focused !== undefined && restrictions.uniqueDiagonals
            ? diagonals(board, getCellAt(focused)).flat()
            : [];

    return (
        <div className="board" id="board">
            {killerCageModalOpen && (
                <KillerCageModal
                    selection={selection}
                    onClose={() => setKillerCageModalOpen(false)}
                />
            )}
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map(({ cell, solutionCell, playerCell, index }, i) => (
                        <Cell
                            key={i}
                            index={index}
                            value={
                                cell.value ??
                                playerCell?.value ??
                                solutionCell?.value
                            }
                            given={cell.given}
                            candidates={solutionCell?.candidates}
                            invalidCandidates={solutionCell?.invalidCandidates}
                            cornerMarks={playerCell?.cornerMarks}
                            centreMarks={playerCell?.centreMarks}
                            focused={focused === index}
                            selection={selection}
                            highlighted={
                                highlightedRow.includes(cell) ||
                                highlightedColumn.includes(cell) ||
                                highlightedBox.includes(cell) ||
                                highlightedThermos.includes(index) ||
                                highlightedKillerCages.includes(index) ||
                                highlightedKingCells.includes(cell) ||
                                highlightedKnightCells.includes(cell) ||
                                highlightedDiagonals.includes(cell)
                            }
                            onMouseDown={(e) => {
                                if (e.button === 0) {
                                    setFocus({
                                        index,
                                        addToSelection: e.shiftKey,
                                    });
                                }
                                if (
                                    e.button === 2 &&
                                    !selection.includes(index)
                                ) {
                                    setFocus({ index });
                                }
                            }}
                            onMouseEnter={({ buttons }) => {
                                if (
                                    buttons === 1 &&
                                    !selection.includes(index)
                                ) {
                                    setFocus({
                                        index,
                                        addToSelection: true,
                                    });
                                }
                            }}
                            onCreateKillerCage={() =>
                                setKillerCageModalOpen(true)
                            }
                        />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Board;
