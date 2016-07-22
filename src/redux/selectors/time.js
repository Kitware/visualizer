// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const isAnimationPlaying = state => !!state.time.playing;
export const getTimeStep = state => state.time.index;
export const getTimeValues = state => state.time.values;
