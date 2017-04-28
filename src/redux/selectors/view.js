import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getRemoteRenderingState = state => access(state).view.remote;

export default {
  getRemoteRenderingState,
};
