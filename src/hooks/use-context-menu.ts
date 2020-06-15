import React, { useEffect } from 'react';
import useAction from './use-action';

const useContextMenu = (
    focused: boolean,
    contextMenuElement: React.ReactNode
) => {
    const setContent = useAction('set-context-menu');
    const open = useAction('set-context-menu-visible');

    useEffect(() => {
        if (focused) setContent(() => contextMenuElement);
    }, [focused, setContent, contextMenuElement]);

    return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        open(true);
        return false;
    };
};

export default useContextMenu;
