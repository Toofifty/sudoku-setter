import React, { useState } from 'react';
import Button from 'components/button';
import Modal from 'components/modal';
import ControlsMenu from 'components/controls-menu';
import useAction from 'hooks/use-action';
import './setter-mobile-controls.scss';
import NumberInput from 'components/number-input';
import useSelector from 'hooks/use-selector';
import ContextMenu from 'components/context-menu';
import UndoRedo from 'components/undo-redo';

const SetterMobileControls = () => {
    const [controlMenuModalOpen, setControlMenuModalOpen] = useState(false);
    const [contextMenuModalOpen, setContextMenuModalOpen] = useState(false);
    const setSelectionValue = useAction('shared/set-selection-value');
    const selection = useSelector((state) => state.ui.selection);

    return (
        <div className="setter-mobile-controls">
            <NumberInput onSetNumber={(value) => setSelectionValue(value)} />
            <UndoRedo />
            <div className="setter-mobile-controls__buttons">
                <Button
                    wide
                    onClick={() => setControlMenuModalOpen(true)}
                    className="text--center"
                >
                    <i className="fad fa-wrench m-r-12" />
                    Configuration
                </Button>
                {controlMenuModalOpen && (
                    <Modal>
                        <Modal.Header
                            onClose={() => setControlMenuModalOpen(false)}
                        >
                            <i className="fad fa-wrench m-r-12" />
                            Setter configuration
                        </Modal.Header>
                        <Modal.Body>
                            <ControlsMenu />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                primary
                                onClick={() => setControlMenuModalOpen(false)}
                            >
                                <i className="fad fa-check m-r-12" />
                                Done
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
                <Button
                    wide
                    onClick={() => setContextMenuModalOpen(true)}
                    className="text--center"
                    disabled={selection.length === 0}
                >
                    <i className="fad fa-pencil m-r-12" />
                    Actions
                </Button>
                {contextMenuModalOpen && (
                    <Modal>
                        <Modal.Header
                            onClose={() => setContextMenuModalOpen(false)}
                        >
                            <i className="fad fa-pencil m-r-12" />
                            Selection actions
                        </Modal.Header>
                        <Modal.Body>
                            <ContextMenu
                                isStatic
                                onAction={() => setContextMenuModalOpen(false)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                primary
                                onClick={() => setContextMenuModalOpen(false)}
                            >
                                <i className="fad fa-check m-r-12" />
                                Done
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default SetterMobileControls;
