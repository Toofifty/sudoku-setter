import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Modal from 'components/modal';
import Menu, { MenuItem } from 'components/menu';
import Toggle from 'components/toggle';
import Button from 'components/button';
import './player-settings-modal.scss';
import { usePointerCoarse } from 'hooks/use-pointer-coarse';

interface PlayerSettingsModalProps {
    onClose: () => void;
}

const PlayerSettingsModal = ({ onClose }: PlayerSettingsModalProps) => {
    const settings = useSelector((state) => state.player.settings);
    const setSettings = useAction('player/set-settings');

    const pointerCoarse = usePointerCoarse();

    return (
        <Modal size="sm" onClose={onClose}>
            <Modal.Header onClose={onClose}>
                <i className="fad fa-wrench m-r-12" />
                Player settings
            </Modal.Header>
            <Modal.Body>
                <Menu className="settings-modal__menu">
                    <MenuItem label="Input modes">
                        <Toggle
                            radio
                            checked={settings.multiInputMode === 'centre'}
                            onChange={() =>
                                setSettings({
                                    multiInputMode: 'centre',
                                })
                            }
                        >
                            Multi-input places centre marks
                        </Toggle>
                        <Toggle
                            radio
                            checked={settings.multiInputMode === 'corner'}
                            onChange={() =>
                                setSettings({
                                    multiInputMode: 'corner',
                                })
                            }
                        >
                            Multi-input places corner marks
                        </Toggle>
                        {!pointerCoarse && (
                            <>
                                <Toggle
                                    checked={!!settings.tabSwitchesInputMode}
                                    onChange={() =>
                                        setSettings({
                                            tabSwitchesInputMode:
                                                !settings.tabSwitchesInputMode,
                                        })
                                    }
                                >
                                    <code>Tab</code> switches input mode
                                </Toggle>
                                <Toggle
                                    checked={!!settings.qSwapsPencilMarks}
                                    onChange={() =>
                                        setSettings({
                                            qSwapsPencilMarks:
                                                !settings.qSwapsPencilMarks,
                                        })
                                    }
                                >
                                    <code>Q</code> swaps corner & centre marks
                                </Toggle>
                            </>
                        )}
                    </MenuItem>
                    <MenuItem label="Highlighting">
                        <Toggle
                            checked={settings.highlightSelection}
                            onChange={() =>
                                setSettings({
                                    highlightSelection:
                                        !settings.highlightSelection,
                                })
                            }
                        >
                            Highlight selection
                        </Toggle>
                        <Toggle
                            checked={settings.outlineSelection}
                            onChange={() =>
                                setSettings({
                                    outlineSelection:
                                        !settings.outlineSelection,
                                })
                            }
                        >
                            Outline selection
                        </Toggle>
                        <Toggle
                            checked={settings.highlightSudokuRestrictions}
                            onChange={() =>
                                setSettings({
                                    highlightSudokuRestrictions:
                                        !settings.highlightSudokuRestrictions,
                                })
                            }
                        >
                            Highlight box / row / column
                        </Toggle>
                        <Toggle
                            checked={settings.highlightMatchingNumbers}
                            onChange={() =>
                                setSettings({
                                    highlightMatchingNumbers:
                                        !settings.highlightMatchingNumbers,
                                })
                            }
                        >
                            Highlight matching numbers
                        </Toggle>
                        <Toggle
                            checked={settings.highlightMiscRestrictions}
                            onChange={() =>
                                setSettings({
                                    highlightMiscRestrictions:
                                        !settings.highlightMiscRestrictions,
                                })
                            }
                        >
                            Highlight extra restrictions
                        </Toggle>
                    </MenuItem>
                    <MenuItem label="Helpers">
                        <Toggle
                            radio
                            checked={
                                !settings.showInvalidMoves &&
                                !settings.showIncorrectMoves
                            }
                            onChange={() =>
                                setSettings({
                                    showInvalidMoves: false,
                                    showIncorrectMoves: false,
                                })
                            }
                        >
                            Don't highlight any errors
                        </Toggle>
                        <Toggle
                            radio
                            checked={settings.showInvalidMoves}
                            onChange={() =>
                                setSettings({
                                    showInvalidMoves:
                                        !settings.showInvalidMoves,
                                    showIncorrectMoves:
                                        settings.showInvalidMoves,
                                })
                            }
                        >
                            Highlight digits that break a restriction
                        </Toggle>
                        <Toggle
                            radio
                            checked={settings.showIncorrectMoves}
                            onChange={() =>
                                setSettings({
                                    showIncorrectMoves:
                                        !settings.showIncorrectMoves,
                                    showInvalidMoves:
                                        settings.showIncorrectMoves,
                                })
                            }
                        >
                            Highlight digits that don't match the solution
                        </Toggle>
                        <Toggle
                            checked={settings.showInvalidMarks}
                            onChange={() =>
                                setSettings({
                                    showInvalidMarks:
                                        !settings.showInvalidMarks,
                                })
                            }
                            helpText="Highlight invalid candidates based on the setting above"
                        >
                            Also highlight candidate conflicts
                        </Toggle>
                    </MenuItem>
                    <MenuItem label="Automation">
                        <Toggle
                            checked={settings.autoFixPencilMarks}
                            onChange={() =>
                                setSettings({
                                    autoFixPencilMarks:
                                        !settings.autoFixPencilMarks,
                                })
                            }
                            helpText="Remove pencil marks when the same digit is placed elsewhere in the region"
                        >
                            Auto-remove pencil marks
                        </Toggle>
                        <Toggle
                            checked={settings.autoTuples}
                            onChange={() =>
                                setSettings({
                                    autoTuples: !settings.autoTuples,
                                })
                            }
                            helpText={
                                <>
                                    Turn corner marks of <strong>n</strong>{' '}
                                    digits in <strong>n</strong> cells of a box
                                    into centre marks
                                </>
                            }
                        >
                            Auto-centre tuples
                        </Toggle>
                        <Toggle
                            checked={settings.autoWriteSnyder}
                            onChange={() =>
                                setSettings({
                                    autoWriteSnyder: !settings.autoWriteSnyder,
                                })
                            }
                            helpText="Fill in digits when there is only one corner mark left in the cell"
                        >
                            Auto-complete with Snyder notation
                        </Toggle>
                        <Toggle
                            checked={settings.autoWriteSets}
                            onChange={() =>
                                setSettings({
                                    autoWriteSets: !settings.autoWriteSets,
                                })
                            }
                            helpText="Fill in digits when there is only one centre mark left in the cell"
                        >
                            Auto-complete centre marks
                        </Toggle>
                    </MenuItem>
                </Menu>
            </Modal.Body>
            <Modal.Footer>
                <Button primary onClick={onClose}>
                    Done
                    <i className="fad fa-check m-l-12" />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PlayerSettingsModal;
