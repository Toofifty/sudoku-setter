import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Modal from 'components/modal';
import Menu from 'components/menu';
import Toggle from 'components/toggle';
import Button from 'components/button';
import './settings-modal.scss';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
    const settings = useSelector((state) => state.player.settings);
    const setSettings = useAction('player/set-settings');

    return (
        <Modal size="sm">
            <Modal.Header onClose={onClose}>
                <i className="fad fa-wrench m-r-12" />
                Player settings
            </Modal.Header>
            <Menu className="settings-modal__menu">
                <Menu.Divider label="Multi-input mode" />
                <Menu.Item>
                    <Toggle
                        radio
                        checked={settings.multiInputMode === 'centre'}
                        onChange={() =>
                            setSettings({
                                multiInputMode: 'centre',
                            })
                        }
                    >
                        Centre
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
                        Corner
                    </Toggle>
                </Menu.Item>
                <Menu.Divider label="Highlighting" />
                <Menu.Item>
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
                </Menu.Item>
                <Menu.Item>
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
                </Menu.Item>
                <Menu.Item>
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
                </Menu.Item>
                <Menu.Divider label="Cheats" />
                <Menu.Item>
                    <Toggle
                        checked={settings.autoFixPencilMarks}
                        onChange={() =>
                            setSettings({
                                autoFixPencilMarks:
                                    !settings.autoFixPencilMarks,
                            })
                        }
                    >
                        Auto-remove pencil marks
                    </Toggle>
                </Menu.Item>
                <Menu.Item>
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
                        Don't highlight any mistakes
                    </Toggle>
                    <Toggle
                        radio
                        checked={settings.showInvalidMoves}
                        onChange={() =>
                            setSettings({
                                showInvalidMoves: !settings.showInvalidMoves,
                                showIncorrectMoves: settings.showInvalidMoves,
                            })
                        }
                    >
                        Highlight moves that break a restriction
                    </Toggle>
                    <Toggle
                        radio
                        checked={settings.showIncorrectMoves}
                        onChange={() =>
                            setSettings({
                                showIncorrectMoves:
                                    !settings.showIncorrectMoves,
                                showInvalidMoves: settings.showIncorrectMoves,
                            })
                        }
                    >
                        Highlight moves that don't match the solution
                    </Toggle>
                </Menu.Item>
            </Menu>
            <Modal.Footer>
                <Button primary onClick={onClose}>
                    Done
                    <i className="fad fa-check m-l-12" />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
