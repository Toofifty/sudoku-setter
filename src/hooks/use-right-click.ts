import React from 'react';
import useAction from './use-action';

const useRightClick = (contextElement: React.ReactNode) => {
    const openContext = useAction('open-context');

    return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openContext(contextElement);
        return false;
    };
};

export default useRightClick;
