import { _, action, merge, GetAction } from './merge';

export interface UIState {
    contextMenu?: () => React.ReactNode;
    contextVisible: boolean;
    debugMode: boolean;
    hideSolution: boolean;
    focused?: number;
    selection: number[];
}

const defaultState = (): UIState => ({
    debugMode: false,
    contextVisible: false,
    hideSolution: false,
    selection: [],
    focused: undefined,
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

const setFocus = action(
    _ as UIState,
    _ as { index: number; isKeyPress?: boolean; addToSelection?: boolean },
    'ui/set-focus',
    (state, { index, isKeyPress, addToSelection }) => {
        console.log('setFocus', { index, isKeyPress, addToSelection });

        if (index !== undefined && (index < 0 || index >= 81)) return state;
        let { focused, selection } = state;
        if (!addToSelection) {
            focused = index;
            selection = [index];
        } else if (!selection.includes(index)) {
            if (isKeyPress) focused = index;
            selection = [...selection, index];
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

export type UIAction =
    | GetAction<typeof setContextMenu>
    | GetAction<typeof toggleContextMenu>
    | GetAction<typeof toggleDebugMode>
    | GetAction<typeof toggleHideSolution>
    | GetAction<typeof setFocus>
    | GetAction<typeof clearFocus>;

export default merge(
    defaultState(),
    setContextMenu,
    toggleContextMenu,
    toggleDebugMode,
    toggleHideSolution,
    setFocus,
    clearFocus
);
