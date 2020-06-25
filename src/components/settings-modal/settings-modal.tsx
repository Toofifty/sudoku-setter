import React from 'react';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import './settings-modal.scss';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
    const settings = useSelector((state) => state.player.settings);
    const setSettings = useAction('player/set-settings');

    return (
        <div className="modal modal-md active">
            <div className="modal-overlay" />
            <div className="modal-container">
                <div className="modal-header">
                    <button
                        className="btn btn-clear float-right"
                        aria-label="Close"
                        onClick={onClose}
                    />
                    <div className="modal-title h5">Player Settings</div>
                </div>
                <ul className="settings-modal menu mb-2">
                    <li className="divider" data-content="Multi-input mode" />
                    <li className="menu-item">
                        <label className="form-radio">
                            <input
                                type="radio"
                                checked={settings.multiInputMode === 'centre'}
                                onChange={() =>
                                    setSettings({
                                        multiInputMode: 'centre',
                                    })
                                }
                            />
                            <i className="form-icon" /> Centre
                        </label>
                        <label className="form-radio">
                            <input
                                type="radio"
                                checked={settings.multiInputMode === 'corner'}
                                onChange={() =>
                                    setSettings({
                                        multiInputMode: 'corner',
                                    })
                                }
                            />
                            <i className="form-icon" /> Corner
                        </label>
                    </li>
                    <li className="divider" data-content="Highlighting" />
                    <li className="menu-item">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={settings.highlightSudokuRestrictions}
                                onChange={() =>
                                    setSettings({
                                        highlightSudokuRestrictions: !settings.highlightSudokuRestrictions,
                                    })
                                }
                            />
                            <i className="form-icon" /> Highlight box / row /
                            column
                        </label>
                    </li>
                    <li className="menu-item">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={settings.highlightMatchingNumbers}
                                onChange={() =>
                                    setSettings({
                                        highlightMatchingNumbers: !settings.highlightMatchingNumbers,
                                    })
                                }
                            />
                            <i className="form-icon" /> Highlight matching
                            numbers
                        </label>
                    </li>
                    <li className="menu-item">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={settings.highlightMiscRestrictions}
                                onChange={() =>
                                    setSettings({
                                        highlightMiscRestrictions: !settings.highlightMiscRestrictions,
                                    })
                                }
                            />
                            <i className="form-icon" /> Highlight extra
                            restrictions
                        </label>
                    </li>
                    <li className="divider" data-content="Cheats" />
                    <li className="menu-item">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={settings.autoFixPencilMarks}
                                onChange={() =>
                                    setSettings({
                                        autoFixPencilMarks: !settings.autoFixPencilMarks,
                                    })
                                }
                            />
                            <i className="form-icon" /> Auto-remove pencil marks
                        </label>
                    </li>
                    <li className="menu-item">
                        <label className="form-radio">
                            <input
                                type="checkbox"
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
                            />
                            <i className="form-icon" /> Don't highlight any
                            mistakes
                        </label>
                        <label className="form-radio">
                            <input
                                type="checkbox"
                                checked={settings.showInvalidMoves}
                                onChange={() =>
                                    setSettings({
                                        showInvalidMoves: !settings.showInvalidMoves,
                                        showIncorrectMoves:
                                            settings.showInvalidMoves,
                                    })
                                }
                            />
                            <i className="form-icon" /> Highlight moves that
                            break a restriction
                        </label>
                        <label className="form-radio">
                            <input
                                type="checkbox"
                                checked={settings.showIncorrectMoves}
                                onChange={() =>
                                    setSettings({
                                        showIncorrectMoves: !settings.showIncorrectMoves,
                                        showInvalidMoves:
                                            settings.showIncorrectMoves,
                                    })
                                }
                            />
                            <i className="form-icon" /> Highlight moves that
                            don't match the solution
                        </label>
                    </li>
                </ul>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
