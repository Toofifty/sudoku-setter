import { useEffect } from 'react';

import useAction from 'hooks/use-action';
import useSelector from 'hooks/use-selector';
import { isEventOver } from 'utils';

interface KeyListenerProps {
    children: React.ReactNode;
}

const KeyListener = ({ children }: KeyListenerProps) => {
    const undo = useAction('shared/undo');
    const redo = useAction('shared/redo');
    const settings = useSelector((state) => state.player.settings);
    const setSelectionValue = useAction('shared/set-selection-value');
    const setFocus = useAction('ui/set-focus');
    const cycleInputMode = useAction('player/cycle-input-mode');
    const swapPencilMarks = useAction('shared/swap-pencil-marks');
    const focused = useSelector((state) => state.ui.focused);

    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if (isEventOver(e, 'form-input', 'form-group', 'nav-bar')) return;

            // handle undo/redo
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z')
                return redo();
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') return undo();

            // handle number input
            const { key, shiftKey } = e;
            const n = Number(key);
            if (!isNaN(n) && n > 0 && n < 10) {
                setSelectionValue(n);
                return;
            }
            if (['Backspace', 'Delete'].includes(key)) {
                setSelectionValue(undefined);
            }

            // handle keyboard selection
            if (key === 'ArrowUp') {
                setFocus({
                    index: (focused ?? 0) - 9,
                    isKeyPress: true,
                    addToSelection: shiftKey,
                });
            } else if (key === 'ArrowDown') {
                setFocus({
                    index: (focused ?? 0) + 9,
                    isKeyPress: true,
                    addToSelection: shiftKey,
                });
            } else if (key === 'ArrowLeft') {
                setFocus({
                    index: (focused ?? 0) - 1,
                    isKeyPress: true,
                    addToSelection: shiftKey,
                });
            } else if (key === 'ArrowRight') {
                setFocus({
                    index: (focused ?? 0) + 1,
                    isKeyPress: true,
                    addToSelection: shiftKey,
                });
            } else if (
                key === ' ' ||
                (key === 'Tab' && settings.tabSwitchesInputMode)
            ) {
                cycleInputMode(shiftKey);
                e.preventDefault();
            } else if (key === 'q' && settings.qSwapsPencilMarks) {
                swapPencilMarks();
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', keyListener);

        return () => {
            window.removeEventListener('keydown', keyListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focused, settings]);

    return <>{children}</>;
};

export default KeyListener;
