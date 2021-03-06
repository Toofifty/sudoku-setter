import React from 'react';
import cx from 'classnames';
import { range } from 'utils';
import useSelector from 'hooks/use-selector';
import './control-box.scss';
import useAction from 'hooks/use-action';
import { canUndoSelector, canRedoSelector } from 'utils/selectors';

const preventFocus = (e: React.MouseEvent) => {
    e.preventDefault();
};

interface ControlBoxProps {
    onShowSettings: () => void;
}

const ControlBox = ({ onShowSettings }: ControlBoxProps) => {
    const inputMode = useSelector((state) => state.player.inputMode);
    const setInputMode = useAction('player/set-input-mode');

    const undo = useAction('shared/undo');
    const canUndo = useSelector(canUndoSelector('player'));
    const redo = useAction('shared/redo');
    const canRedo = useSelector(canRedoSelector('player'));

    const setSelectionValue = useAction('shared/set-selection-value');

    return (
        <div className="control-box menu">
            <div className="control-box__section">
                <div className="control-box__input-mode">
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
                </div>
                <div className="control-box__numbers">
                    {range(1, 10).map((n) => (
                        <button
                            className="btn btn-primary control-box__number-btn"
                            key={n}
                            onClick={() => setSelectionValue(n)}
                            onMouseDown={preventFocus}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                <div className="control-box__actions">
                    <button
                        className="btn btn-light"
                        disabled={!canUndo}
                        onClick={() => undo()}
                        onMouseDown={preventFocus}
                    >
                        <i className="icon icon-refresh flip-horiz" />
                    </button>
                    <button
                        className="btn btn-light"
                        disabled={!canRedo}
                        onClick={() => redo()}
                        onMouseDown={preventFocus}
                    >
                        <i className="icon icon-refresh" />
                    </button>
                    <button
                        className="btn btn-light btn-error"
                        onClick={() => setSelectionValue(undefined)}
                        onMouseDown={preventFocus}
                    >
                        <i className="icon icon-delete" />
                    </button>
                </div>
            </div>
            <div className="control-box__section">
                <button
                    className="btn btn-light alone"
                    onClick={onShowSettings}
                >
                    <i className="icon icon-more-horiz" />
                </button>
                <div className="control-box__colors"></div>
                <button className="btn btn-light btn-success alone">
                    <i className="icon icon-check" />
                </button>
            </div>
        </div>
    );
};

export default ControlBox;
