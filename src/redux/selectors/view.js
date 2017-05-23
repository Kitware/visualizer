import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getRemoteRenderingState = state => access(state).view.remote;
export const getRemoteFpsState = state => access(state).view.remoteFps;

export default {
  getRemoteRenderingState,
  getRemoteFpsState,
};
