import React from 'react';
import cx from 'classnames';

import { range } from 'utils';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import { canRedoSelector, canUndoSelector } from 'utils/selectors';
import { useIsDigitCompleted } from 'utils/use-is-digit-completed';
import Tooltip from 'components/tooltip';

import './player-keypad.scss';

const preventFocus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

const PlayerKeypad = () => {
    const inputMode = useSelector((state) => state.player.inputMode);
    const setInputMode = useAction('player/set-input-mode');

    const undo = useAction('shared/undo');
    const canUndo = useSelector(canUndoSelector('player'));
    const redo = useAction('shared/redo');
    const canRedo = useSelector(canRedoSelector('player'));

    const isDigitCompleted = useIsDigitCompleted();

    const setSelectionValue = useAction('shared/set-selection-value');

    return (
        <div className="keypad">
            <div className="keypad__actions">
                <Tooltip content="Undo" anchor="bottom">
                    <button
                        className="btn btn-light"
                        disabled={!canUndo}
                        onClick={() => undo()}
                        onMouseDown={preventFocus}
                    >
                        <i className="fa fa-undo" />
                    </button>
                </Tooltip>
                <Tooltip content="Redo" anchor="bottom">
                    <button
                        className="btn btn-light"
                        disabled={!canRedo}
                        onClick={() => redo()}
                        onMouseDown={preventFocus}
                    >
                        <i className="fa fa-redo" />
                    </button>
                </Tooltip>
                <Tooltip content="Preserve selection" anchor="bottom">
                    <button
                        className="btn btn-light"
                        onClick={() => {}}
                        onMouseDown={preventFocus}
                        disabled
                    >
                        <i className="fa fa-game-board-alt" />
                    </button>
                </Tooltip>
                <Tooltip content="Delete" anchor="bottom">
                    <button
                        className="btn btn-light btn-error"
                        onClick={() => setSelectionValue(undefined)}
                        onMouseDown={preventFocus}
                    >
                        <i className="fa fa-backspace" />
                    </button>
                </Tooltip>
            </div>
            <div className="keypad__numbers">
                {range(1, 10).map((n) => (
                    <button
                        className="btn btn-primary keypad__number-btn"
                        key={n}
                        onClick={() => setSelectionValue(n)}
                        onMouseDown={preventFocus}
                        disabled={isDigitCompleted(n)}
                    >
                        {n}
                    </button>
                ))}
            </div>
            <div className="keypad__input-mode">
                <Tooltip content="Place digits" anchor="bottom">
                    <button
                        className={cx(
                            'btn btn-light',
                            inputMode === 'digit' && 'btn-active'
                        )}
                        onClick={() => setInputMode('digit')}
                        onMouseDown={preventFocus}
                    >
                        1
                    </button>
                </Tooltip>
                <Tooltip content="Use corner notation" anchor="bottom">
                    <button
                        className={cx(
                            'btn btn-light corners',
                            inputMode === 'corner' && 'btn-active'
                        )}
                        onClick={() => setInputMode('corner')}
                        onMouseDown={preventFocus}
                    >
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                    </button>
                </Tooltip>
                <Tooltip content="Use centre notation" anchor="bottom">
                    <button
                        className={cx(
                            'btn btn-light centre',
                            inputMode === 'centre' && 'btn-active'
                        )}
                        onClick={() => setInputMode('centre')}
                        onMouseDown={preventFocus}
                    >
                        123
                    </button>
                </Tooltip>
                <Tooltip content="Use colors" anchor="bottom">
                    <button
                        className={cx('btn btn-light centre')}
                        onClick={() => {}}
                        onMouseDown={preventFocus}
                        disabled
                    >
                        <i className="fa fa-palette" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default PlayerKeypad;
