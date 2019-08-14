/* eslint-disable import/no-cycle */
import network from '../../network';
import * as netActions from './network';
import { fetchProxy } from './proxies';

// --- Action types -----------------------------------------------------------

const TIME_STORE = 'TIME_STORE';
const TIME_ANIMATION_STORE = 'TIME_ANIMATION_STORE';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  index: -1,
  values: [],
  playing: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TIME_STORE: {
      let { index, values } = action;
      values = values || state.values;
      index %= values.length;
      return Object.assign({}, state, { index, values });
    }

    case TIME_ANIMATION_STORE: {
      return Object.assign({}, state, { playing: !!action.play });
    }

    case 'RESET_VISUALIZER_STATE': {
      return initialState;
    }

    default:
      return state;
  }
}

// --- Action Creators --------------------------------------------------------

// --- Pure actions ---

export function storeTime(index, values) {
  return { type: TIME_STORE, index, values };
}

export function resetTime() {
  return { type: TIME_STORE, index: 0, values: [] };
}

export function storeTimeAnimation(play) {
  return { type: TIME_ANIMATION_STORE, play };
}

// --- Async actions ---

export function fetchTime() {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Fetch time values');
    network
      .getClient()
      .TimeHandler.getTimeValues()
      .then(
        (values) => {
          dispatch(netActions.success(netRequest.id, values));
          if (values.length) {
            const netRequestTimeStep = netActions.createRequest(
              'Fetch time step'
            );
            dispatch(netRequestTimeStep);
            network
              .getClient()
              .TimeHandler.getTimeStep()
              .then(
                (index) => {
                  dispatch(netActions.success(netRequestTimeStep.id, index));
                  dispatch(storeTime(index, values));
                },
                (err) => {
                  dispatch(netActions.error(netRequestTimeStep.id, err));
                }
              );
          } else {
            dispatch(resetTime());
          }
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );

    return netRequest;
  };
}

export function applyTimeStep(index, proxyIdToUpdate) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Apply time step');
    network
      .getClient()
      .TimeHandler.setTimeStep(index)
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
          dispatch(storeTime(index));
          if (proxyIdToUpdate && proxyIdToUpdate !== '0') {
            dispatch(fetchProxy(proxyIdToUpdate));
          }
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function playTime(delatT = 0.01) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Start time animation');
    network
      .getClient()
      .TimeHandler.play(delatT)
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    dispatch(storeTimeAnimation(true));
    return netRequest;
  };
}

export function stopTime() {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Stop time animation');
    network
      .getClient()
      .TimeHandler.stop()
      .then(
        (ok) => {
          dispatch(netActions.success(netRequest.id, ok));
          dispatch(storeTimeAnimation(false));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}
