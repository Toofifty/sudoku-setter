import { _, action, merge, GetAction } from './merge';

export interface UIState {
    contextMenu?: () => React.ReactNode;
    contextVisible: boolean;
    debugMode: boolean;
    hideSolution: boolean;
}

const defaultState = (): UIState => ({
    debugMode: false,
    contextVisible: false,
    hideSolution: false,
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

const toggleDebugMode = action(
    _ as UIState,
    _ as boolean | undefined,
    'ui/toggle-debug-mode',
    (state, debugMode) => ({
        ...state,
        debugMode: debugMode ?? !state.debugMode,
    })
);

const toggleHideSolution = action(
    _ as UIState,
    _ as boolean | undefined,
    'ui/toggle-hide-solution',
    (state, hideSolution) => ({
        ...state,
        hideSolution: hideSolution ?? !state.hideSolution,
    })
);

export type UIAction =
    | GetAction<typeof setContextMenu>
    | GetAction<typeof toggleContextMenu>
    | GetAction<typeof toggleDebugMode>
    | GetAction<typeof toggleHideSolution>;

export default merge(
    defaultState(),
    setContextMenu,
    toggleContextMenu,
    toggleDebugMode,
    toggleHideSolution
);
