import { getRootState } from '..';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const isAnimationPlaying = state => !!getRootState(state).time.playing;
export const getTimeStep = state => getRootState(state).time.index;
export const getTimeValues = state => getRootState(state).time.values;
