import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const isAnimationPlaying = (state) => !!access(state).time.playing;
export const getTimeStep = (state) => access(state).time.index;
export const getTimeValues = (state) => access(state).time.values;
