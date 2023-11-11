import React from 'react';
import ColorPicker from 'components/color-picker';
import useSelector from 'hooks/use-selector';
import { getPosition } from 'utils/sudoku';
import { isFilled } from 'utils/solve/helper';
import {
    isContiguous,
    isContiguousSequential,
    isContiguousSequentialWithPill,
} from 'utils/contiguous';
import useAction from 'hooks/use-action';
import NumberInput from 'components/number-input';
import UndoRedo from 'components/undo-redo';
import { MenuDivider, MenuItem } from 'components/menu';
import Button from 'components/button';
import useModal from 'hooks/use-modal';
import KillerCageModal from 'components/killer-cage-modal';
import ArrowModal from 'components/arrow-modal';

interface CellContextMenuProps {
    index: number;
}

const CellContextMenu = ({ index }: CellContextMenuProps) => {
    const color = useSelector((state) => state.puzzle.board[index].color);
    const selection = useSelector((state) => state.ui.selection);
    const { board, thermos, arrows, killerCages } = useSelector(
        (state) => state.puzzle
    );
    const setColor = useAction('puzzle/set-color');
    const createThermo = useAction('shared/create-thermo');
    const deleteThermo = useAction('shared/delete-thermo');
    const deleteArrow = useAction('shared/delete-arrow');
    const deleteKillerCage = useAction('shared/delete-killer-cage');
    const setValue = useAction('shared/set-cell-value');

    const pos = getPosition(index);

    const hasThermo = thermos.some((thermo) => thermo.includes(index));
    const hasArrow = arrows.some(
        ({ head, tail }) => head.includes(index) || tail.includes(index)
    );
    const hasKillerCage = killerCages.some(({ cage }) => cage.includes(index));

    const cell = board[index];
    const value = isFilled(cell) ? cell.value : undefined;

    const openKillerCageModal = useModal(
        <KillerCageModal
            selection={selection}
            onClose={() => openKillerCageModal(false)}
        />
    );

    const openArrowModal = useModal(
        <ArrowModal
            selection={selection}
            onClose={() => openArrowModal(false)}
        />
    );

    return (
        <>
            <MenuItem>
                <NumberInput
                    onSetNumber={(value) =>
                        setValue({ index, value: value || undefined })
                    }
                    selected={value}
                />
            </MenuItem>
            <MenuItem>
                <UndoRedo />
            </MenuItem>
            <MenuDivider
                label={`Set ${
                    selection.length > 1
                        ? 'selection'
                        : `r${pos.y + 1}c${pos.x + 1}`
                } color`}
            />
            <MenuItem>
                <ColorPicker
                    color={color ?? 'white'}
                    onSelect={(color) => setColor({ index: selection, color })}
                />
            </MenuItem>
            {selection.length <= 9 && isContiguous(selection, true) && (
                <>
                    <MenuDivider label={`Selection (${selection.length})`} />
                    {selection.length > 1 && (
                        <>
                            {isContiguousSequential(selection, true) && (
                                <MenuItem>
                                    <Button
                                        wide
                                        onClick={() => createThermo(selection)}
                                    >
                                        <i className="fad fa-temperature-up m-r-12" />
                                        Create thermo
                                    </Button>
                                </MenuItem>
                            )}
                            {isContiguousSequentialWithPill(
                                selection,
                                true
                            ) && (
                                <MenuItem>
                                    <Button
                                        wide
                                        onClick={() => openArrowModal(true)}
                                    >
                                        <i className="fad fa-bullseye-arrow m-r-12" />
                                        Create arrow
                                    </Button>
                                </MenuItem>
                            )}
                        </>
                    )}
                    {isContiguous(selection) && (
                        <MenuItem>
                            <Button
                                wide
                                onClick={() => openKillerCageModal(true)}
                            >
                                <i className="fad fa-border-none m-r-12" />
                                Create killer cage
                            </Button>
                        </MenuItem>
                    )}
                </>
            )}
            {(hasThermo || hasArrow || hasKillerCage) && (
                <>
                    <li className="divider" data-content="Variants" />
                    {hasThermo && (
                        <MenuItem>
                            <Button
                                danger
                                wide
                                onClick={() => deleteThermo(index)}
                            >
                                <i className="fa fa-trash m-r-12" />
                                Delete thermo at{' '}
                                <strong>
                                    r{pos.y + 1}c{pos.x + 1}
                                </strong>
                            </Button>
                        </MenuItem>
                    )}
                    {hasArrow && (
                        <MenuItem>
                            <Button
                                danger
                                wide
                                onClick={() => deleteArrow(index)}
                            >
                                <i className="fa fa-trash m-r-12" />
                                Delete arrow at{' '}
                                <strong>
                                    r{pos.y + 1}c{pos.x + 1}
                                </strong>
                            </Button>
                        </MenuItem>
                    )}
                    {hasKillerCage && (
                        <MenuItem>
                            <Button
                                danger
                                wide
                                onClick={() => deleteKillerCage(index)}
                            >
                                <i className="fa fa-trash m-r-12" />
                                Delete killer cage at{' '}
                                <strong>
                                    r{pos.y + 1}c{pos.x + 1}
                                </strong>
                            </Button>
                        </MenuItem>
                    )}
                </>
            )}
        </>
    );
};

export default CellContextMenu;
