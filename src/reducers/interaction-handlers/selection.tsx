import React from 'react';
import CellContextMenu from 'components/cell/cell-context-menu';
import { InteractionHandler } from './types';
import { isCorner } from './util';

export const selectionInteractionHandler: InteractionHandler = {
    onInteractStart({ dispatch }, { index, buttons, shiftKey }) {
        if (buttons !== 1) {
            return;
        }

        dispatch({
            type: 'ui/set-focus',
            payload: { index, addToSelection: shiftKey },
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
