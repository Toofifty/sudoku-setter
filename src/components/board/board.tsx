import React, { useEffect, useState } from 'react';
import './board.scss';
import useSelector from '../../hooks/use-selector';
import { ICell, Position } from '../../types';
import { getBoxIndex, getCellAt } from '../../util/sudoku';
import Box from '../box';
import Cell from '../cell';
import useAction from '../../hooks/use-action';
import { useSudokuReducer } from '../../util/reduce';
import { row, column, box } from '../../util/reduce/helper';

const Board = () => {
    const board = useSelector((state) => state.sudoku.board);
    const shouldReduce = useSelector((state) => state.sudoku.shouldReduce);
    const setValue = useAction('set-value');
    const clearValue = useAction('clear-value');
    const setShouldReduce = useAction('set-should-reduce');
    const sudokuReduce = useSudokuReducer();

    const [focused, _setFocused] = useState<number | null>(null);
    const [selected, setSelected] = useState<number[]>([]);

    const setFocused = (index: number) => {
        if (index >= 0 && index < 81) _setFocused(index);
    };

    useEffect(() => {
        if (shouldReduce) {
            setTimeout(() => {
                setShouldReduce(false);
                sudokuReduce();
            }, 0);
        }
    }, [shouldReduce, setShouldReduce, sudokuReduce]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!e.ctrlKey && !e.metaKey) setSelected([]);
        };
        window.addEventListener('mousedown', onClick);

        return () => {
            window.removeEventListener('mousedown', onClick);
        };
    }, []);

    const boxes = board.reduce(
        (boxes, cell, i) => {
            const pos = getCellAt(i);
            const index = getBoxIndex(pos);
            if (!boxes[index]) {
                boxes[index] = [];
            }
            boxes[index].push({ cell, pos, index: i });
            return boxes;
        },
        [[], [], [], [], [], [], [], [], []] as {
            cell: ICell;
            pos: Position;
            index: number;
        }[][]
    );

    const highlightedRow =
        focused !== null && selected.length === 1
            ? row(board, getCellAt(focused))
            : [];

    const highlightedColumn =
        focused !== null && selected.length === 1
            ? column(board, getCellAt(focused))
            : [];

    const highlightedBox =
        focused !== null && selected.length === 1
            ? box(board, getCellAt(focused))
            : [];

    return (
        <div className="board">
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map(({ cell, pos, index }, i) => (
                        <Cell
                            key={i}
                            {...cell}
                            num={index}
                            focus={focused === index}
                            selected={selected.includes(index)}
                            highlighted={
                                highlightedRow.includes(cell) ||
                                highlightedColumn.includes(cell) ||
                                highlightedBox.includes(cell)
                            }
                            onFocus={() => {
                                setFocused(index);
                                setSelected([...selected, index]);
                            }}
                            onClick={() => {}}
                            onMouseEnter={({ buttons }) => {
                                if (buttons) {
                                    setSelected([...selected, index]);
                                }
                            }}
                            onKeyDown={({ key }) => {
                                const n = Number(key);
                                if (!isNaN(n) && n > 0 && n < 10) {
                                    setValue({
                                        cell: pos,
                                        value: n,
                                        given: true,
                                    });
                                    return;
                                }
                                if (key === 'ArrowUp') {
                                    setFocused(index - 9);
                                    setSelected([index - 9]);
                                } else if (key === 'ArrowDown') {
                                    setFocused(index + 9);
                                    setSelected([index + 9]);
                                } else if (key === 'ArrowLeft') {
                                    setFocused(index - 1);
                                    setSelected([index - 1]);
                                } else if (key === 'ArrowRight') {
                                    setFocused(index + 1);
                                    setSelected([index + 1]);
                                }
                                if (['Backspace', 'Delete'].includes(key)) {
                                    clearValue(pos);
                                }
                            }}
                        />
                    ))}
                </Box>
            ))}
        </div>
    );
};

export default Board;
