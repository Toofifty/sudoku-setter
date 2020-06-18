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
    const setValue = useAction('shared/set-cell-value');
    const setSolved = useAction('solver/set-solved');
    const solve = useSudokuSolver();
    const undo = useAction('shared/undo');
    const redo = useAction('shared/redo');

    const [focused, _setFocused] = useState<number | null>(null);
    const [selection, setSelection] = useState<number[]>([]);
    const [killerCageModalOpen, setKillerCageModalOpen] = useState(false);

    const setFocused = (
        index: number,
        isKeyPress = false,
        addToSelection = false
    ) => {
        if (index >= 0 && index < 81) {
            if (!addToSelection) {
                _setFocused(index);
                setSelection([index]);
            } else if (!selection.includes(index)) {
                if (isKeyPress) _setFocused(index);
                setSelection([...selection, index]);
            }
        }
    };

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
                _setFocused(null);
                setSelection([]);
            }
        };

        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('click', onClick);
        };
    }, [selection]);

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
        focused !== null ? row(board, getCellAt(focused)) : [];

    const highlightedColumn =
        focused !== null ? column(board, getCellAt(focused)) : [];

    const highlightedBox =
        focused !== null ? box(board, getCellAt(focused)) : [];

    const highlightedThermos =
        focused !== null && thermos
            ? thermos.filter((thermo) => thermo.includes(focused)).flat()
            : [];

    const highlightedKillerCages =
        focused !== null && killerCages
            ? killerCages
                  .filter(({ cage }) => cage.includes(focused))
                  .map(({ cage }) => cage)
                  .flat()
            : [];

    const highlightedKingCells =
        focused !== null && restrictions.antiKing
            ? king(board, getCellAt(focused))
            : [];

    const highlightedKnightCells =
        focused !== null && restrictions.antiKnight
            ? knight(board, getCellAt(focused))
            : [];

    const highlightedDiagonals =
        focused !== null && restrictions.uniqueDiagonals
            ? diagonals(board, getCellAt(focused)).flat()
            : [];

    const onKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z')
            return redo();
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') return undo();
    };

    return (
        <div className="board" onKeyDown={onKeyDown}>
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
                                    setFocused(index, false, e.shiftKey);
                                }
                                if (
                                    e.button === 2 &&
                                    !selection.includes(index)
                                ) {
                                    setFocused(index);
                                    setSelection([]);
                                }
                            }}
                            onMouseEnter={({ buttons }) => {
                                if (
                                    buttons === 1 &&
                                    !selection.includes(index)
                                ) {
                                    setSelection([...selection, index]);
                                }
                            }}
                            onKeyDown={({ key, shiftKey }) => {
                                const n = Number(key);
                                if (!isNaN(n) && n > 0 && n < 10) {
                                    setValue({
                                        index,
                                        value: n,
                                    });
                                    return;
                                }
                                if (key === 'ArrowUp') {
                                    setFocused(index - 9, true, shiftKey);
                                } else if (key === 'ArrowDown') {
                                    setFocused(index + 9, true, shiftKey);
                                } else if (key === 'ArrowLeft') {
                                    setFocused(index - 1, true, shiftKey);
                                } else if (key === 'ArrowRight') {
                                    setFocused(index + 1, true, shiftKey);
                                }
                                if (['Backspace', 'Delete'].includes(key)) {
                                    selection.forEach((i) =>
                                        setValue({ index: i })
                                    );
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
