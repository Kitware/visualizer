import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getRemoteRenderingState = (state) => access(state).view.remote;
export const getRemoteFpsState = (state) => access(state).view.remoteFps;
export const getRemoteInteractiveQualityState = (state) =>
  access(state).view.interactiveQuality;
export const getRemoteInteractiveRatioState = (state) =>
  access(state).view.interactiveRatio;

export default {
  getRemoteRenderingState,
  getRemoteFpsState,
  getRemoteInteractiveQualityState,
  getRemoteInteractiveRatioState,
};
