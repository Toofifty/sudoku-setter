import ArrowModal from 'components/arrow-modal';
import { IconStack } from 'components/icon-stack';
import { Keypad } from 'components/keypad';
import KillerCageModal from 'components/killer-cage-modal';
import PlayerSettingsModal from 'components/player-settings-modal';
import useAction from 'hooks/use-action';
import useModal from 'hooks/use-modal';
import useSelector from 'hooks/use-selector';
import {
    isContiguous,
    isContiguousSequential,
    isContiguousSequentialWithPill,
} from 'utils/contiguous';
import { canRedoSelector, canUndoSelector } from 'utils/selectors';

export const MobileKeypad = () => {
    const selection = useSelector((state) => state.ui.selection);
    const createThermo = useAction('shared/create-thermo');

    const undo = useAction('shared/undo');
    const canUndo = useSelector(canUndoSelector('puzzle'));
    const redo = useAction('shared/redo');
    const canRedo = useSelector(canRedoSelector('puzzle'));

    const debugMode = useSelector((state) => state.ui.debugMode);
    const toggleDebugMode = useAction('ui/toggle-debug-mode');
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const toggleHideSolution = useAction('ui/toggle-hide-solution');

    const setSelectionValue = useAction('shared/set-selection-value');

    const reset = useAction('shared/reset');

    const openPlayerSettingsModal = useModal(
        <PlayerSettingsModal onClose={() => openPlayerSettingsModal(false)} />
    );

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
        <Keypad>
            <Keypad.Column>
                <Keypad.Button success tooltip="Test puzzle" onClick={() => {}}>
                    <i className="fad fa-play" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Player settings"
                    onClick={() => openPlayerSettingsModal(true)}
                >
                    <IconStack main="fad fa-play" secondary="fa fa-wrench" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Puzzle settings"
                    onClick={() => openPlayerSettingsModal(true)}
                >
                    <IconStack
                        main="fad fa-puzzle-piece"
                        secondary="fa fa-wrench"
                    />
                </Keypad.Button>
            </Keypad.Column>
            <Keypad.Column>
                <Keypad.Button
                    success={debugMode}
                    tooltip="Debug mode"
                    onClick={() => toggleDebugMode()}
                >
                    <i className="fad fa-bug" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Test puzzle"
                    onClick={() => toggleHideSolution()}
                >
                    <i
                        className={
                            hideSolution ? 'fa fa-eye-slash' : 'fa fa-eye'
                        }
                    />
                </Keypad.Button>
                <Keypad.Button
                    danger
                    tooltip="Reset grid"
                    onClick={() => reset()}
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
                    tooltip="Preserve selection"
                    disabled
                    onClick={() => {}}
                >
                    <i className="fa fa-game-board-alt" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Delete"
                    danger
                    onClick={() => setSelectionValue(undefined)}
                >
                    <i className="fa fa-backspace" />
                </Keypad.Button>
            </Keypad.Column>
            <Keypad.Digits>
                <Keypad.Button
                    tooltip="Add thermo"
                    onClick={() => createThermo(selection)}
                    disabled={
                        selection.length < 2 ||
                        selection.length > 9 ||
                        !isContiguousSequential(selection, true)
                    }
                >
                    <i className="fad fa-temperature-up" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Add arrow"
                    onClick={() => openArrowModal(true)}
                    disabled={
                        selection.length < 2 ||
                        selection.length > 9 ||
                        !isContiguousSequentialWithPill(selection, true)
                    }
                >
                    <i className="fad fa-bullseye-arrow" />
                </Keypad.Button>
                <Keypad.Button
                    tooltip="Add cage"
                    onClick={() => openKillerCageModal(true)}
                    disabled={selection.length > 9 || !isContiguous(selection)}
                >
                    <i className="fad fa-border-none" />
                </Keypad.Button>
            </Keypad.Digits>
            <Keypad.Column>
                <Keypad.Button success tooltip="Solve" onClick={() => {}}>
                    <i className="fad fa-badge-check" />
                </Keypad.Button>
                <Keypad.Button tooltip="Solve settings" onClick={() => {}}>
                    <IconStack
                        main="fad fa-badge-check"
                        secondary="fa fa-wrench"
                    />
                </Keypad.Button>
            </Keypad.Column>
        </Keypad>
    );
};
