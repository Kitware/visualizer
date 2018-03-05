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
export const getThrottleTime = (state) => access(state).view.throttleTime;
export const getServerMaxFPS = (state) => access(state).view.serverMaxFPS;

export default {
  getRemoteRenderingState,
  getRemoteFpsState,
  getRemoteInteractiveQualityState,
  getRemoteInteractiveRatioState,
  getThrottleTime,
};
