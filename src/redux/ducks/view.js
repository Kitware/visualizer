import network from '../../network';
import * as netActions from './network';

const REMOTE_RENDERING = 'REMOTE_RENDERING';
const REMOTE_FPS = 'REMOTE_FPS';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  remote: true,
  remoteFps: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REMOTE_RENDERING: {
      return Object.assign({}, state, { remote: action.remote });
    }
    case REMOTE_FPS: {
      return Object.assign({}, state, { remoteFps: action.remoteFps });
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

// --- Async actions ---

export function resetCamera() {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Reset camera');
    network.getClient()
      .ViewPort
      .resetCamera()
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function updateCamera(viewId, focalPoint, viewUp, position) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Update camera');
    network.getClient()
      .ViewPort
      .updateCamera(viewId, focalPoint, viewUp, position)
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}
