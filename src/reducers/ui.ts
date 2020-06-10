interface UIState {
    context?: React.ReactNode;
}

const defaultState = (): UIState => ({});

type OpenContext = { type: 'open-context'; payload: React.ReactNode };

const openContext = (state: UIState, context: React.ReactNode) => ({
    ...state,
    context,
});

type CloseContext = { type: 'close-context'; payload: undefined };

const closeContext = (state: UIState) => ({ ...state, context: undefined });

export type UIAction = OpenContext | CloseContext;

export default (state = defaultState(), action: UIAction) => {
    switch (action.type) {
        case 'open-context':
            return openContext(state, action.payload);
        case 'close-context':
            return closeContext(state);
        default:
            return state;
    }
};
