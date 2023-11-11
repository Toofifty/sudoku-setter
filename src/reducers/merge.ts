export const _ = null as unknown;

type Action<TType extends string, TPayload> = {
    type: TType;
    payload: TPayload;
};

type ActionObject<TState, TType extends string, TPayload> = {
    type: TType;
    action: (state: TState, payload: TPayload, dispatch: any) => TState;
};

export const action = <TState, TType extends string, TPayload>(
    stateType: TState,
    payloadType: TPayload,
    type: TType,
    action: (state: TState, payload: TPayload, dispatch: any) => TState,
    ...decorators: any[]
) => ({
    type,
    action: decorators.reduce((value, decorator) => {
        return decorator(value);
    }, action) as (state: TState, payload: TPayload, dispatch: any) => TState,
});

export type GetAction<TFrom extends ActionObject<any, any, any>> = Action<
    TFrom['type'],
    Parameters<TFrom['action']>[1]
>;

export const merge =
    <TState>(
        defaultState?: TState,
        ...actions: ActionObject<TState, string, any>[]
    ) =>
    (state = defaultState, action: any) => {
        const target = actions.find(({ type }) => type === action.type);
        if (target)
            return target.action(state as any, action.payload, action.dispatch);
        return state!;
    };
