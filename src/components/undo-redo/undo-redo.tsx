import React from 'react';
import useAction from 'hooks/use-action';
import useSelector from 'hooks/use-selector';
import { canUndoSelector, canRedoSelector } from 'utils/selectors';
import Button from 'components/button';
import './undo-redo.scss';

const UndoRedo = () => {
    const undo = useAction('shared/undo');
    const redo = useAction('shared/redo');
    const canUndo = useSelector(canUndoSelector('puzzle'));
    const canRedo = useSelector(canRedoSelector('player'));

    return (
        <div className="undo-redo">
            <Button
                className="text--center m-r-8 fg-1"
                onClick={() => undo()}
                disabled={!canUndo}
            >
                Undo
                <i className="fa fa-undo m-l-12" />
            </Button>
            <Button
                className="text--center m-l-8 fg-1"
                onClick={() => redo()}
                disabled={!canRedo}
            >
                <i className="fa fa-redo m-r-12" />
                Redo
            </Button>
        </div>
    );
};

export default UndoRedo;
