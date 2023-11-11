import { DispatchFn, RootState } from 'store';

export type Subcell =
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'left'
    | 'centre'
    | 'right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right';

export type InteractionData = {
    index: number;
    subcell: Subcell;
    /**
     * Button last interacted with (0=left, 1=middle, 2=right)
     */
    button: number;
    /**
     * Bitset of buttons currently pressed (0=none, 1=left, 2=right, 4=middle)
     */
    buttons: number;
    shiftKey: boolean;
};

export type InteractionContext = {
    state: RootState;
    dispatch: DispatchFn;
};

export interface InteractionHandler {
    onInteractStart?: (
        context: InteractionContext,
        interaction: InteractionData
    ) => void;
    onInteractMove?: (
        context: InteractionContext,
        interaction: InteractionData
    ) => void;
    onInteractEnd?: (
        context: InteractionContext,
        interaction: InteractionData
    ) => void;
}
