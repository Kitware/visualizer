import network from '../../network';
import * as netActions from './network';

// --- Reducer ----------------------------------------------------------------

export default function reducer(state, action) {
  return state;
}

// --- Action Creators --------------------------------------------------------

// --- Async actions ---

export function resetCamera() {
  return dispatch => {
    const netRequest = netActions.createRequest('Reset camera');
    network.getClient()
      .ViewPort
      .resetCamera()
      .then(
        ok => {
          dispatch(netActions.success(netRequest.id, ok));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}
