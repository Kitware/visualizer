import network from '../../network';
import * as netActions from './network';

const REMOTE_RENDERING = 'REMOTE_RENDERING';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  remote: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REMOTE_RENDERING: {
      return Object.assign({}, state, { remote: action.remote });
    }

    default:
      return state;
  }
}

// --- Action Creators --------------------------------------------------------

export function setRemoteRendering(remote) {
  return { type: REMOTE_RENDERING, remote };
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
