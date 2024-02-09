import React from 'react';

import './player-aux-keypad.scss';
import Tooltip from 'components/tooltip';
import useModal from 'hooks/use-modal';
import PlayerSettingsModal from 'components/player-settings-modal';

const PlayerAuxKeypad = () => {
    const openPlayerSettingsModal = useModal(
        <PlayerSettingsModal onClose={() => openPlayerSettingsModal(false)} />
    );

    return (
        <div className="keypad">
            <div className="keypad__actions">
                <Tooltip content="Settings" anchor="bottom">
                    <button
                        className="btn btn-light"
                        onClick={() => openPlayerSettingsModal(true)}
                    >
                        <i className="fa fa-wrench" />
                    </button>
                </Tooltip>
                <Tooltip content="Help" anchor="bottom">
                    <button className="btn btn-light" onClick={() => {}}>
                        <i className="far fa-question" />
                    </button>
                </Tooltip>
                <Tooltip content="Check solution" anchor="bottom">
                    <button
                        className="btn btn-light btn-success"
                        onClick={() => {}}
                    >
                        <i className="fa fa-check" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default PlayerAuxKeypad;
