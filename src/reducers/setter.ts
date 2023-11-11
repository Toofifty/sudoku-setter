import { Arrow, KillerCage, Thermo } from 'utils/sudoku-types';
import { _, GetAction, action, merge } from './merge';
import { load, persist } from './persist';

export type SetterInputMode = 'digit' | 'arrow' | 'thermo' | 'cage';

export type PartialVariants = {
    thermo?: Thermo;
    arrow?: Partial<Arrow>;
    cage?: Partial<KillerCage>;
};

export interface SetterState {
    inputMode: SetterInputMode;
    partialVariants: PartialVariants;
}

const defaultState = (): SetterState => ({
    partialVariants: {},
    ...load('setter', {
        inputMode: 'digit',
    }),
});

const setInputMode = action(
    _ as SetterState,
    _ as SetterInputMode,
    'setter/set-input-mode',
    (state, inputMode) => ({ ...state, inputMode }),
    persist('setter', 'inputMode')
);

const setPartialVariants = action(
    _ as SetterState,
    _ as PartialVariants,
    'setter/set-partial-variants',
    (state, partialVariants) => ({ ...state, partialVariants })
);

export type SetterAction =
    | GetAction<typeof setInputMode>
    | GetAction<typeof setPartialVariants>;

export default merge<SetterState>(
    defaultState(),
    setInputMode,
    setPartialVariants
);
