import { interactionHandlers } from './interaction-handlers';
import { InteractionHandler } from './interaction-handlers/types';
import { _, action, merge, GetAction } from './merge';
import { load, persist } from './persist';
import { SetterInputMode } from './setter';

export interface UIState {
    contextMenu?: () => React.ReactNode;
    contextVisible: boolean;
    modal?: () => React.ReactNode;
    modalVisible: boolean;
    debugMode: boolean;
    hideSolution: boolean;
    focused?: number;
    selection: number[];
    interactionHandler: InteractionHandler;
}

const defaultState = (): UIState => ({
    contextVisible: false,
    modalVisible: false,
    selection: [],
    focused: undefined,
    interactionHandler:
        interactionHandlers[
            load('setter', { inputMode: 'digit' as SetterInputMode }).inputMode
        ],
    ...load('ui', {
        hideSolution: false,
        debugMode: false,
    }),
});

const setContextMenu = action(
    _ as UIState,
    _ as () => React.ReactNode | undefined,
    'ui/set-context-menu',
    (state, contextMenu) => ({ ...state, contextMenu })
);

const toggleContextMenu = action(
    _ as UIState,
    _ as boolean | undefined,
    'ui/toggle-context-menu',
    (state, contextVisible) => ({
        ...state,
        contextVisible: contextVisible ?? !state.contextVisible,
    })
);

const setModal = action(
    _ as UIState,
    _ as () => React.ReactNode | undefined,
    'ui/set-modal',
    (state, modal) => ({ ...state, modal })
);

const toggleModal = action(
    _ as UIState,
    _ as boolean | undefined,
    'ui/toggle-modal',
    (state, modalVisible) => ({
        ...state,
        modalVisible: modalVisible ?? !state.modalVisible,
    })
);

const toggleDebugMode = action(
    _ as UIState,
    _ as boolean | undefined,
    'ui/toggle-debug-mode',
    (state, debugMode) => ({
        ...state,
        debugMode: debugMode ?? !state.debugMode,
    }),
    persist('ui', 'hideSolution', 'debugMode')
);

const toggleHideSolution = action(
    _ as UIState,
    _ as boolean | undefined,
    'ui/toggle-hide-solution',
    (state, hideSolution) => ({
        ...state,
        hideSolution: hideSolution ?? !state.hideSolution,
    }),
    persist('ui', 'hideSolution', 'debugMode')
);

const setFocus = action(
    _ as UIState,
    _ as { index: number; isKeyPress?: boolean; addToSelection?: boolean },
    'ui/set-focus',
    (state, { index, isKeyPress, addToSelection }) => {
        if (index !== undefined && (index < 0 || index >= 81)) return state;

        let { focused, selection } = state;
        if (!addToSelection) {
            focused = index;
            selection = [index];
        } else if (!selection.includes(index)) {
            if (isKeyPress) focused = index;
            selection = [...selection, index];
        } else if (isKeyPress) {
            focused = index;
        } else {
            // deselect TODO
        }

        return {
            ...state,
            focused,
            selection,
        };
    }
);

const clearFocus = action(
    _ as UIState,
    _ as undefined,
    'ui/clear-focus',
    (state) => ({
        ...state,
        focused: undefined,
        selection: [],
    })
);

const setInteractionHandler = action(
    _ as UIState,
    _ as InteractionHandler,
    'ui/set-interaction-handler',
    (state, interactionHandler) => ({
        ...state,
        interactionHandler,
    })
);

export type UIAction =
    | GetAction<typeof setContextMenu>
    | GetAction<typeof toggleContextMenu>
    | GetAction<typeof setModal>
    | GetAction<typeof toggleModal>
    | GetAction<typeof toggleDebugMode>
    | GetAction<typeof toggleHideSolution>
    | GetAction<typeof setFocus>
    | GetAction<typeof clearFocus>
    | GetAction<typeof setInteractionHandler>;

export default merge(
    defaultState(),
    setContextMenu,
    toggleContextMenu,
    setModal,
    toggleModal,
    toggleDebugMode,
    toggleHideSolution,
    setFocus,
    clearFocus,
    setInteractionHandler
);
