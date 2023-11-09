import { _, GetAction, action, merge } from './merge';

export type SetterInputMode = 'digit' | 'arrow' | 'thermo' | 'cage';

export interface SetterState {
    inputMode: SetterInputMode;
}

const defaultState = (): SetterState => ({
    inputMode: 'digit',
});

const setInputMode = action(
    _ as SetterState,
    _ as SetterInputMode,
    'setter/set-input-mode',
    (state, inputMode) => ({ ...state, inputMode })
);

export type SetterAction = GetAction<typeof setInputMode>;

export default merge<SetterState>(defaultState(), setInputMode);
