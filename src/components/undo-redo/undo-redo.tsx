import React from 'react';
import useAction from 'hooks/use-action';
import useSelector from 'hooks/use-selector';
import './undo-redo.scss';

const UndoRedo = () => {
    const undo = useAction('shared/undo');
    const redo = useAction('shared/redo');
    const canUndo = useSelector(({ puzzle }) => puzzle.history.current > 0);
    const canRedo = useSelector(
        ({ puzzle }) =>
            puzzle.history.current !== puzzle.history.items.length - 1
    );

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
