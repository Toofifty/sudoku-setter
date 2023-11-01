import { useEffect, useState } from 'react';
import useAction from './use-action';

const useModal = (modalElement: React.ReactNode) => {
    const [open, setOpen] = useState(false);
    const setModal = useAction('ui/set-modal');
    const toggle = useAction('ui/toggle-modal');

    useEffect(() => {
        console.log('setmodal', open);
        if (open) {
            setModal(() => modalElement);
        }
        toggle(open);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, setModal, toggle]);

    return setOpen;
};

export default useModal;
