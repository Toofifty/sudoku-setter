import { RootState } from 'store';

export const isPlayModeSelector = (state: RootState) =>
    state.puzzle.mode === 'play';

export const isSetModeSelector = (state: RootState) =>
    state.puzzle.mode === 'set';
