import React from 'react';
import cx from 'classnames';
import { range } from 'utils';
import useSelector from 'hooks/use-selector';
import './control-box.scss';
import useAction from 'hooks/use-action';
import { canUndoSelector, canRedoSelector } from 'utils/selectors';

const ControlBox = () => {
    const inputMode = useSelector((state) => state.player.inputMode);
    const setInputMode = useAction('player/set-input-mode');

    const undo = useAction('shared/undo');
    const canUndo = useSelector(canUndoSelector('player'));
    const redo = useAction('shared/redo');
    const canRedo = useSelector(canRedoSelector('player'));

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
                    >
                        1
                    </button>
                    <button
                        className={cx(
                            'btn btn-light corners',
                            inputMode === 'corner' && 'btn-active'
                        )}
                        onClick={() => setInputMode('corner')}
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
                    >
                        123
                    </button>
                </div>
                <div className="control-box__numbers">
                    {range(1, 10).map((n) => (
                        <button
                            className="btn btn-primary control-box__number-btn"
                            key={n}
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
                    >
                        <i className="icon icon-refresh flip-horiz" />
                    </button>
                    <button
                        className="btn btn-light"
                        disabled={!canRedo}
                        onClick={() => redo()}
                    >
                        <i className="icon icon-refresh" />
                    </button>
                    <button className="btn btn-light btn-error">
                        <i className="icon icon-delete" />
                    </button>
                </div>
            </div>
            <div className="control-box__section">
                <button className="btn btn-light alone">
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
