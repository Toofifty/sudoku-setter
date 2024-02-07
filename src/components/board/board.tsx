import React, { useEffect, useMemo } from 'react';
import { isSetModeSelector } from 'utils/selectors';
import useSelector from '../../hooks/use-selector';
import { PuzzleCell, SolutionCell, PlayerCell } from '../../types';
import { getBoxIndex, getPosition } from '../../utils/sudoku';
import Box from '../box';
import Cell from '../cell';
import useAction from '../../hooks/use-action';
import { isEventOver, useHighlightedCells } from 'utils';
import { useSudokuSolver } from '../../utils/solve';
import './board.scss';

const Board = () => {
    const { board, killerCages } = useSelector((state) => state.puzzle);
    const isSetMode = useSelector(isSetModeSelector);
    const { dirty, solution } = useSelector((state) => state.solver);
    const { board: playerBoard } = useSelector((state) => state.player);
    const { selection, focused } = useSelector((state) => state.ui);
    const { value: targetValue, cells: highlighted } = useHighlightedCells();
    const setSolved = useAction('solver/set-solved');
    const solve = useSudokuSolver();

    const clearFocus = useAction('ui/clear-focus');

    const killerCageStarts = useMemo(
        () => killerCages.map(({ cage }) => Math.min(...cage)),
        [killerCages]
    );

    useEffect(() => {
        if (dirty) {
            solve();
            setSolved();
        }
    }, [dirty, setSolved, solve]);

    // remove selection on click-away
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                !isEventOver(
                    e,
                    'board',
                    'menu',
                    'modal',
                    'button',
                    'interaction-layer',
                    'keypad'
                )
            ) {
                clearFocus();
            }
        };

        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('click', onClick);
        };
    }, [clearFocus]);

    const boxes = useMemo(() => {
        return board.reduce(
            (boxes, cell, i) => {
                const pos = getPosition(i);
                const index = getBoxIndex(pos);
                if (!boxes[index]) {
                    boxes[index] = [];
                }
                boxes[index].push({
                    cell,
                    solutionCell: {
                        ...solution[i],
                        ...(isSetMode ? {} : { value: undefined }),
                    },
                    playerCell: playerBoard[i],
                    index: i,
                });
                return boxes;
            },
            [[], [], [], [], [], [], [], [], []] as {
                cell: PuzzleCell;
                solutionCell: SolutionCell;
                playerCell?: PlayerCell;
                index: number;
            }[][]
        );
    }, [board, isSetMode, playerBoard, solution]);

    return (
        <div className="board" id="board">
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
                            topLeftBlocked={killerCageStarts.includes(index)}
                            focused={focused === index}
                            selection={selection}
                            targetValue={targetValue}
                            highlighted={highlighted.includes(index)}
                        />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Board;
