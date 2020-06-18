import React from 'react';
import useAction from 'hooks/use-action';
import useSelector from 'hooks/use-selector';
import { canUndoSelector, canRedoSelector } from 'utils/selectors';
import './undo-redo.scss';

const UndoRedo = () => {
    const undo = useAction('shared/undo');
    const redo = useAction('shared/redo');
    const canUndo = useSelector(canUndoSelector('puzzle'));
    const canRedo = useSelector(canRedoSelector('player'));

    return (
        <li className="menu-item undo-redo">
            <button
                className="btn mr-2"
                onClick={() => undo()}
                disabled={!canUndo}
            >
                <i className="icon icon-back mr-2" /> Undo
            </button>
            <button
                className="btn ml-2"
                onClick={() => redo()}
                disabled={!canRedo}
            >
                Redo <i className="icon icon-forward ml-2" />
            </button>
        </li>
    );
};

export default UndoRedo;
