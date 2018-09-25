import network from '../../network';
import * as netActions from './network';

const REMOTE_RENDERING = 'REMOTE_RENDERING';
const REMOTE_FPS = 'REMOTE_FPS';
const REMOTE_INTERACTIVE_QUALITY = 'REMOTE_INTERACTIVE_QUALITY';
const REMOTE_INTERACTIVE_RATIO = 'REMOTE_INTERACTIVE_RATIO';
const EVENT_THROTTLING_TIME = 'EVENT_THROTTLING_TIME';
const SERVER_MAX_FPS = 'SERVER_MAX_FPS';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  remote: true,
  remoteFps: false,
  interactiveQuality: 50,
  interactiveRatio: 1,
  throttleTime: 16.6,
  serverMaxFPS: 30,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REMOTE_RENDERING: {
      return Object.assign({}, state, { remote: action.remote });
    }
    case REMOTE_FPS: {
      return Object.assign({}, state, { remoteFps: action.remoteFps });
    }
    case REMOTE_INTERACTIVE_QUALITY: {
      return Object.assign({}, state, {
        interactiveQuality: action.quality,
      });
    }
    case REMOTE_INTERACTIVE_RATIO: {
      return Object.assign({}, state, {
        interactiveRatio: action.ratio,
      });
    }
    case EVENT_THROTTLING_TIME: {
      return Object.assign({}, state, {
        throttleTime: action.time,
      });
    }
    case SERVER_MAX_FPS: {
      return Object.assign({}, state, {
        serverMaxFPS: action.maxFPS,
      });
    }

    default:
      return state;
  }
}

// --- Bind UI callbacks ------------------------------------------------------

let resetCameraCallback = () => {};
export function setResetCameraCallback(fn) {
  resetCameraCallback = fn;
}

// --- Action Creators --------------------------------------------------------

export function setRemoteRendering(remote) {
  return { type: REMOTE_RENDERING, remote };
}

export function setRemoteFps(remoteFps) {
  return { type: REMOTE_FPS, remoteFps };
}

export function setInteractiveQuality(quality) {
  return { type: REMOTE_INTERACTIVE_QUALITY, quality };
}

export function setInteractiveRatio(ratio) {
  return { type: REMOTE_INTERACTIVE_RATIO, ratio };
}

export function setEventThrottleTime(time) {
  return { type: EVENT_THROTTLING_TIME, time };
}

export function setServerMaxFPS(maxFPS) {
  return { type: SERVER_MAX_FPS, maxFPS };
}

// --- Async actions ---

export function resetCamera() {
  resetCameraCallback();
  return (dispatch) => {
    const netRequest = netActions.createRequest('Reset camera');
    network
      .getClient()
      .ViewPort.resetCamera()
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function updateCamera(viewId, focalPoint, viewUp, position) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Update camera');
    network
      .getClient()
      .ViewPort.updateCamera(viewId, focalPoint, viewUp, position)
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}
