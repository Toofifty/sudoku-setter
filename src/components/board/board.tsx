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
        if (index >= 0 && index < 81) {
            _setFocused(index);
            if (!selected.includes(index)) setSelected([...selected, index]);
        }
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
            if (!e.ctrlKey && !e.metaKey && e.button !== 2) setSelected([]);
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
        focused !== null ? row(board, getCellAt(focused)) : [];

    const highlightedColumn =
        focused !== null ? column(board, getCellAt(focused)) : [];

    const highlightedBox =
        focused !== null ? box(board, getCellAt(focused)) : [];

    return (
        <div className="board">
            {boxes.map((box, i) => (
                <Box key={i}>
                    {box.map(({ cell, pos, index }, i) => (
                        <Cell
                            key={i}
                            {...cell}
                            num={index}
                            pos={pos}
                            focus={focused === index}
                            selected={selected.includes(index)}
                            selection={selected}
                            highlighted={
                                highlightedRow.includes(cell) ||
                                highlightedColumn.includes(cell) ||
                                highlightedBox.includes(cell)
                            }
                            onMouseDown={(e) => {
                                console.log(e.button);
                                if (e.button === 0) {
                                    setFocused(index);
                                }
                                if (
                                    e.button === 2 &&
                                    !selected.includes(index)
                                ) {
                                    setFocused(index);
                                    setSelected([]);
                                }
                            }}
                            onMouseEnter={({ buttons }) => {
                                if (
                                    buttons === 1 &&
                                    !selected.includes(index)
                                ) {
                                    setSelected([...selected, index]);
                                }
                            }}
                            onKeyDown={({ key, shiftKey }) => {
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
                                    if (!shiftKey) setSelected([index - 9]);
                                } else if (key === 'ArrowDown') {
                                    setFocused(index + 9);
                                    if (!shiftKey) setSelected([index + 9]);
                                } else if (key === 'ArrowLeft') {
                                    setFocused(index - 1);
                                    if (!shiftKey) setSelected([index - 1]);
                                } else if (key === 'ArrowRight') {
                                    setFocused(index + 1);
                                    if (!shiftKey) setSelected([index + 1]);
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
