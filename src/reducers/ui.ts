interface UIState {
    contextMenu?: () => React.ReactNode;
    debugMode: boolean;
    hideSolution: boolean;
    placeOnClick: boolean;
}

const defaultState = (): UIState => ({
    debugMode: process.env.NODE_ENV === 'development',
    hideSolution: false,
    placeOnClick: false,
});

type OpenContextMenu = {
    type: 'open-context-menu';
    payload: () => React.ReactNode;
};

const openContextMenu = (
    state: UIState,
    contextMenu: () => React.ReactNode
) => ({
    ...state,
    contextMenu,
});

type CloseContextMenu = { type: 'close-context-menu'; payload: undefined };

const closeContextMenu = (state: UIState) => ({
    ...state,
    contextMenu: undefined,
});

type SetDebugMode = { type: 'set-debug-mode'; payload: boolean };

const setDebugMode = (state: UIState, debugMode: boolean) => ({
    ...state,
    debugMode,
});

type SetHideSolution = { type: 'set-hide-solution'; payload: boolean };

const setHideSolution = (state: UIState, hideSolution: boolean) => ({
    ...state,
    hideSolution,
});

type SetPlaceOnClick = { type: 'set-place-on-click'; payload: boolean };

const setPlaceOnClick = (state: UIState, placeOnClick: boolean) => ({
    ...state,
    placeOnClick,
});

export type UIAction =
    | OpenContextMenu
    | CloseContextMenu
    | SetDebugMode
    | SetHideSolution
    | SetPlaceOnClick;

export default (state = defaultState(), action: UIAction) => {
    switch (action.type) {
        case 'open-context-menu':
            return openContextMenu(state, action.payload);
        case 'close-context-menu':
            return closeContextMenu(state);
        case 'set-debug-mode':
            return setDebugMode(state, action.payload);
        case 'set-hide-solution':
            return setHideSolution(state, action.payload);
        case 'set-place-on-click':
            return setPlaceOnClick(state, action.payload);
        default:
            return state;
    }
};
