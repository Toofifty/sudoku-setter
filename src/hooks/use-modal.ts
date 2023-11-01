import { useEffect, useState } from 'react';
import useAction from './use-action';

const useModal = (modalElement: React.ReactNode) => {
    const [open, setOpen] = useState(false);
    const setModal = useAction('ui/set-modal');
    const toggle = useAction('ui/toggle-modal');

    useEffect(() => {
        if (open) {
            setModal(() => modalElement);
        }
        toggle(open);
    }, [modalElement, open, setModal, toggle]);

    return setOpen;
};

export default useModal;
