interface UIState {
    context?: React.ReactNode;
    debugMode: boolean;
    hideSolution: boolean;
    placeOnClick: boolean;
}

const defaultState = (): UIState => ({
    debugMode: process.env.NODE_ENV === 'development',
    hideSolution: false,
    placeOnClick: false,
});

type OpenContext = { type: 'open-context'; payload: React.ReactNode };

const openContext = (state: UIState, context: React.ReactNode) => ({
    ...state,
    context,
});

type CloseContext = { type: 'close-context'; payload: undefined };

const closeContext = (state: UIState) => ({ ...state, context: undefined });

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
    | OpenContext
    | CloseContext
    | SetDebugMode
    | SetHideSolution
    | SetPlaceOnClick;

export default (state = defaultState(), action: UIAction) => {
    switch (action.type) {
        case 'open-context':
            return openContext(state, action.payload);
        case 'close-context':
            return closeContext(state);
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
