import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import { canRedoSelector, canUndoSelector } from 'utils/selectors';
import { Keypad } from 'components/keypad';
import useModal from 'hooks/use-modal';
import PlayerSettingsModal from 'components/player-settings-modal';
import './player-keypad.scss';

const PlayerKeypad = () => {
    const inputMode = useSelector((state) => state.player.inputMode);
    const setInputMode = useAction('player/set-input-mode');

    const undo = useAction('shared/undo');
    const canUndo = useSelector(canUndoSelector('player'));
    const redo = useAction('shared/redo');
    const canRedo = useSelector(canRedoSelector('player'));

    const preserveSelection = useSelector(
        (state) => state.ui.preserveSelection
    );
    const togglePreserveSelection = useAction('ui/toggle-preserve-selection');

    const reset = useAction('player/reset');

    const setSelectionValue = useAction('shared/set-selection-value');

    const openPlayerSettingsModal = useModal(
        <PlayerSettingsModal onClose={() => openPlayerSettingsModal(false)} />
    );

    return (
        <Keypad className="player-keypad">
            <Keypad.Column>
                <Keypad.Button
                    tooltip="Settings"
                    onClick={() => openPlayerSettingsModal(true)}
                >
                    <i className="fa fa-wrench" />
                </Keypad.Button>
                <Keypad.Button tooltip="Help" onClick={() => {}}>
                    <i className="fa fa-question" />
                </Keypad.Button>
                <Keypad.Button
                    success
                    tooltip="Check solution"
                    onClick={() => {}}
                >
                    <i className="fa fa-check" />
                </Keypad.Button>
                <Keypad.Button
                    danger
                    tooltip="Reset grid"
                    onClick={() => {
                        if (confirm('Are you sure you want to reset?')) {
                            reset();
                        }
                    }}
                >
                    <i className="fad fa-bomb" />
                </Keypad.Button>
            </Keypad.Column>
            <Keypad.Column>
                <Keypad.Button
                    tooltip="Undo"
                    disabled={!canUndo}
                    onClick={undo}
                >
                    <i className="fa fa-undo" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Redo"
                    disabled={!canRedo}
                    onClick={redo}
                >
                    <i className="fa fa-redo" />
                </Keypad.Button>
                <Keypad.Button
                    selected={preserveSelection}
                    tooltip="Preserve selection"
                    onClick={() => togglePreserveSelection()}
                >
                    <i className="fa fa-game-board-alt" />
                </Keypad.Button>
            </Keypad.Column>
            <Keypad.Digits>
                <Keypad.Button
                    tooltip="Delete"
                    danger
                    onClick={() => setSelectionValue(undefined)}
                >
                    <i className="fa fa-backspace" />
                </Keypad.Button>
            </Keypad.Digits>
            <Keypad.Column>
                <Keypad.Button
                    tooltip="Place digits"
                    onClick={() => setInputMode('digit')}
                    selected={inputMode === 'digit'}
                >
                    1
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Use corner notation"
                    onClick={() => setInputMode('corner')}
                    selected={inputMode === 'corner'}
                    className="player-keypad__corners"
                >
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Use centre notation"
                    onClick={() => setInputMode('centre')}
                    selected={inputMode === 'centre'}
                    className="player-keypad__centre"
                >
                    123
                </Keypad.Button>
                <Keypad.Button tooltip="Use colors" disabled onClick={() => {}}>
                    <i className="fa fa-palette" />
                </Keypad.Button>
            </Keypad.Column>
        </Keypad>
    );
};

export default PlayerKeypad;
