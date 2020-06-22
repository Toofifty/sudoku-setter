import React, { useEffect } from 'react';
import useAction from './use-action';

const useContextMenu = (
    focused: boolean,
    contextMenuElement: React.ReactNode
) => {
    const setContextMenu = useAction('ui/set-context-menu');
    const open = useAction('ui/toggle-context-menu');

    useEffect(() => {
        if (focused) setContextMenu(() => contextMenuElement);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focused, setContextMenu]);

    return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        open(true);
        return false;
    };
};

export default useContextMenu;
