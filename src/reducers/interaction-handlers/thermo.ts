import { isAdjacent } from 'utils/sudoku';

import { InteractionHandler } from './types';
import { isCorner } from './util';

export const thermoInteractionHandler: InteractionHandler = {
    onInteractStart({ state, dispatch }, { index, button, shiftKey }) {
        // right click - chop off end of thermo
        // shift-right click - delete thermo

        if (button === 2) {
            const thermo = state.puzzle.thermos.find((thermo) =>
                thermo.includes(index)
            );
            if (!thermo) {
                return;
            }

            // delete the thermo
            dispatch({
                type: 'shared/delete-thermo',
                payload: index,
            });

            if (shiftKey || thermo.indexOf(index) <= 1) {
                // shift is full delete - so just return
                // also delete the thermo if it is less
                // than 2 cells after the slice
                return;
            }

            dispatch({
                type: 'shared/create-thermo',
                payload: thermo.slice(0, thermo.indexOf(index)),
            });
        }

        // shift-left click - extend existing thermo (if present)
        // left click - start new thermo
        // both of these are done on move, not start (so ghost is visible)
    },
    onInteractMove({ state, dispatch }, { index, subcell, buttons, shiftKey }) {
        if (isCorner(subcell)) {
            return;
        }

        // if no mouse button, show ghost thermos
        if (buttons === 0) {
            if (shiftKey) {
                // existing thermo: if this is the end of an existing
                // thermo, then we can edit it
                const thermos = state.puzzle.thermos;
                const target = thermos.find(
                    (thermo) =>
                        thermo[thermo.length - 1] === index && thermo.length < 9
                );
                if (target) {
                    // turn target into a ghost thermo
                    dispatch({
                        type: 'setter/set-partial-variants',
                        payload: { thermo: target },
                    });

                    // remove from thermo set
                    dispatch({
                        type: 'puzzle/delete-thermo',
                        payload: index,
                    });
                    return;
                }
            }

            // new thermo: create a ghost thermo bulb
            // at the cursor position
            const partialThermo = state.setter.partialVariants.thermo;
            if (partialThermo && partialThermo.length > 1) {
                // if we're already drawing a thermo with a length
                // (i.e. editing an existing thermo)
                if (!partialThermo.includes(index)) {
                    // and we've moved off of it
                    // promote it to a real thermo and
                    // start a new ghost
                    dispatch({
                        type: 'shared/create-thermo',
                        payload: partialThermo,
                    });
                    dispatch({
                        type: 'setter/set-partial-variants',
                        payload: { thermo: [index] },
                    });
                }
                return;
            }

            dispatch({
                type: 'setter/set-partial-variants',
                payload: { thermo: [index] },
            });
        }

        if (buttons === 1) {
            const thermo = state.setter.partialVariants.thermo;
            // if index is second last on thermo - user probably
            // wanted to go back
            if (
                thermo &&
                thermo.indexOf(index) > -1 &&
                thermo.indexOf(index) === thermo.length - 2
            ) {
                dispatch({
                    type: 'setter/set-partial-variants',
                    payload: { thermo: thermo.slice(0, -1) },
                });
                return;
            }

            if (
                !thermo ||
                thermo.includes(index) ||
                thermo.length >= 9 ||
                !isAdjacent(thermo[thermo.length - 1], index, true)
            ) {
                return;
            }
            dispatch({
                type: 'setter/set-partial-variants',
                payload: { thermo: [...thermo, index] },
            });
        }
    },
    onInteractEnd({ state, dispatch }, { button, buttons }) {
        const thermo = state.setter.partialVariants.thermo;
        if (thermo && thermo.length > 1) {
            // promote to real thermo
            dispatch({
                type: 'shared/create-thermo',
                payload: thermo,
            });
        }

        // clear partials
        dispatch({
            type: 'setter/set-partial-variants',
            payload: {},
        });
    },
    onInteractLeave({ dispatch }) {
        dispatch({
            type: 'setter/set-partial-variants',
            payload: {},
        });
    },
};
