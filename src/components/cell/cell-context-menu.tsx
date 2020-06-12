import React from 'react';
import ColorPicker from 'components/color-picker';
import useSelector from 'hooks/use-selector';
import { getCellAt } from 'utils/sudoku';
import useAction from 'hooks/use-action';
import { isContiguous, isContiguousSequential } from 'utils/contiguous';

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
    const color = useSelector((state) => state.sudoku.colors[index]);
    const { thermos, killerCages } = useSelector((state) => state.sudoku);
    const setColor = useAction('set-color');
    const createThermo = useAction('create-thermo');
    const deleteThermo = useAction('delete-thermo');
    const deleteKillerCage = useAction('delete-killer-cage');

    const pos = getCellAt(index);

    const hasThermo = thermos?.some((thermo) => thermo.includes(index));
    const hasKillerCage = killerCages?.some(({ cage }) => cage.includes(index));

    return (
        <>
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
                    color={color}
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