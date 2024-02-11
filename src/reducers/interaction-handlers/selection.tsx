import CellContextMenu from 'components/cell/cell-context-menu';

import { InteractionHandler } from './types';
import { isCorner } from './util';

export const selectionInteractionHandler: InteractionHandler = {
    onInteractStart({ state, dispatch }, { index, buttons, shiftKey }) {
        if (buttons !== 1) {
            return;
        }

        const { preserveSelection } = state.ui;

        dispatch({
            type: 'ui/set-focus',
            payload: { index, addToSelection: shiftKey || preserveSelection },
        });
    },
    onInteractMove({ state, dispatch }, { index, buttons, subcell }) {
        if (buttons !== 1 || isCorner(subcell)) {
            return;
        }

        if (!state.ui.selection.includes(index)) {
            dispatch({
                type: 'ui/set-focus',
                payload: { index, addToSelection: true },
            });
        }
    },
    onInteractEnd({ dispatch }, { index, button }) {
        if (button !== 2) {
            return;
        }

        // handle context menu
        dispatch({
            type: 'ui/set-context-menu',
            payload: () => <CellContextMenu index={index} />,
        });
        dispatch({
            type: 'ui/toggle-context-menu',
            payload: true,
        });
    },
};
