import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { RootActionType } from '../reducers';

type FindByType<TType, TValue> = TType extends { type: TValue } ? TType : never;

const useAction = <T extends RootActionType['type']>(
    type: T
): ((payload?: FindByType<RootActionType, T>['payload']) => void) => {
    const dispatch = useDispatch();
    return useCallback((payload: any) => dispatch({ type, payload }), [
        type,
        dispatch,
    ]) as any;
};

export default useAction;
