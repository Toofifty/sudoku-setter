import React from 'react';
import { Portal } from 'react-portal';

import useSelector from 'hooks/use-selector';

const ModalHost = () => {
    const content = useSelector((state) => state.ui.modal);
    const isVisible = useSelector((state) => state.ui.modalVisible);

    if (!content || !isVisible) return null;

    return <Portal>{content()}</Portal>;
};

export default ModalHost;
