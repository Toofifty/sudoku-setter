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
                <ul className="settings-modal menu">
                    <li className="divider" data-content="Highlighting" />
                    <li className="menu-item">
                        <label className="form-switch">
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
                        <label className="form-switch">
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
                        <label className="form-switch">
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
                </ul>
            </div>
        </div>
    );
};

export default SettingsModal;
