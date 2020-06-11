import React from 'react';
import useAction from './use-action';

const useContextMenu = (contextMenuElement: React.ReactNode) => {
    const openContextMenu = useAction('open-context-menu');

    return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openContextMenu(() => contextMenuElement);
        return false;
    };
};

export default useContextMenu;
