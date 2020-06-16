import React from 'react';
import ColorPicker from 'components/color-picker';
import useSelector from 'hooks/use-selector';
import { getCellAt } from 'utils/sudoku';
import useAction from 'hooks/use-action';
import { isContiguous, isContiguousSequential } from 'utils/contiguous';
import NumberInput from 'components/number-input';
import { isFilled } from 'utils/solve/helper';

interface CellContextMenuProps {
    selection: number[];
    index: number;
    onCreateKillerCage: () => void;
}

const CellContextMenu = ({
    selection,
    index,
    onCreateKillerCage,
}: CellContextMenuProps) => {
    const color = useSelector((state) => state.puzzle.board[index].color);
    const { board, thermos, killerCages } = useSelector(
        (state) => state.puzzle
    );
    const setColor = useAction('puzzle/set-color');
    const createThermo = useAction('shared/create-thermo');
    const deleteThermo = useAction('shared/delete-thermo');
    const deleteKillerCage = useAction('shared/delete-killer-cage');
    const setValue = useAction('shared/set-cell-value');

    const pos = getCellAt(index);

    const hasThermo = thermos?.some((thermo) => thermo.includes(index));
    const hasKillerCage = killerCages?.some(({ cage }) => cage.includes(index));

    const cell = board[index];
    const value = isFilled(cell) ? cell.value : undefined;

    return (
        <>
            <li className="menu-item">
                <NumberInput
                    onSetNumber={(value) =>
                        setValue({ index, value: value || undefined })
                    }
                    selected={value}
                />
            </li>
            <li
                className="divider"
                data-content={`Set ${
                    selection.length > 1
                        ? 'selection'
                        : `r${pos.y + 1}c${pos.x + 1}`
                } color`}
            />
            <li className="menu-item">
                <ColorPicker
                    color={color ?? 'white'}
                    onSelect={(color) => setColor({ index: selection, color })}
                />
            </li>
            {selection.length <= 9 && isContiguous(selection, true) && (
                <>
                    <li
                        className="divider"
                        data-content={`Selection (${selection.length})`}
                    />
                    {selection.length > 1 &&
                        isContiguousSequential(selection, true) && (
                            <li className="menu-item">
                                <button
                                    className="btn-fake-link"
                                    onClick={() => createThermo(selection)}
                                >
                                    Selection to thermo
                                </button>
                            </li>
                        )}
                    {isContiguous(selection) && (
                        <li className="menu-item">
                            <button
                                className="btn-fake-link"
                                onClick={onCreateKillerCage}
                            >
                                Selection to killer cage
                            </button>
                        </li>
                    )}
                </>
            )}
            {(hasThermo || hasKillerCage) && (
                <>
                    <li className="divider" data-content="Variants" />
                    {hasThermo && (
                        <li className="menu-item">
                            <button
                                className="btn-fake-link"
                                onClick={() => deleteThermo(index)}
                            >
                                Delete thermo at{' '}
                                <strong>
                                    r{pos.y + 1}c{pos.x + 1}
                                </strong>
                            </button>
                        </li>
                    )}
                    {hasKillerCage && (
                        <li className="menu-item">
                            <button
                                className="btn-fake-link"
                                onClick={() => deleteKillerCage(index)}
                            >
                                Delete killer cage at{' '}
                                <strong>
                                    r{pos.y + 1}c{pos.x + 1}
                                </strong>
                            </button>
                        </li>
                    )}
                </>
            )}
        </>
    );
};

export default CellContextMenu;
