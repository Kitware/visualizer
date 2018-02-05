import network from '../../network';
import * as netActions from './network';

const REMOTE_RENDERING = 'REMOTE_RENDERING';
const REMOTE_FPS = 'REMOTE_FPS';
const REMOTE_INTERACTIVE_QUALITY = 'REMOTE_INTERACTIVE_QUALITY';
const REMOTE_INTERACTIVE_RATIO = 'REMOTE_INTERACTIVE_RATIO';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  remote: true,
  remoteFps: false,
  interactiveQuality: 50,
  interactiveRatio: 0.5,
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

    default:
      return state;
  }
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

// --- Async actions ---

export function resetCamera() {
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
