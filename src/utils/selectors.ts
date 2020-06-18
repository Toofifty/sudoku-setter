import { RootState } from 'store';

export const isPlayModeSelector = (state: RootState) =>
    state.puzzle.mode === 'play';

export const isSetModeSelector = (state: RootState) =>
    state.puzzle.mode === 'set';

export const canUndoSelector = (type: 'puzzle' | 'player') => (
    state: RootState
) => state[type].history.current > 0;

export const canRedoSelector = (type: 'puzzle' | 'player') => (
    state: RootState
) => state[type].history.current < state[type].history.items.length - 1;
