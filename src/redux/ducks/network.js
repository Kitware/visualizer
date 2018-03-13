/* eslint-disable no-shadow */
// --- Global variables ---

let uniqueRequestId = 1;

// --- Action types -----------------------------------------------------------

const NETWORK_REQUEST = 'NETWORK_REQUEST';
const NETWORK_SUCCESS = 'NETWORK_SUCCESS';
const NETWORK_ERROR = 'NETWORK_ERROR';
const FREE_NETWORK_REQUESTS = 'FREE_NETWORK_REQUESTS';
const PROGRESS_UPDATE = 'PROGRESS_UPDATE';

function now() {
  return +new Date();
}

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  requests: {},
  pending: [],
  success: [],
  error: [],
  progress: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NETWORK_REQUEST: {
      const requests = Object.assign({}, state.requests, {
        [action.id]: { message: action.message, start: action.start },
      });
      const pending = state.pending.concat(action.id);
      return Object.assign({}, state, { requests, pending });
    }

    case NETWORK_SUCCESS: {
      if (!state.requests[action.id]) {
        console.error('no request for', action.id, action.data);
      }
      const requests = Object.assign({}, state.requests, {
        [action.id]: {
          message: state.requests[action.id].message,
          data: action.data,
          start: state.requests[action.id].start,
          end: action.end,
        },
      });
      const success = state.success.concat(action.id);
      const pending = state.pending.filter((id) => id !== action.id);
      return Object.assign({}, state, { requests, pending, success });
    }

    case NETWORK_ERROR: {
      if (!state.requests[action.id]) {
        console.error('no request for', action.id, action.data);
      }
      const requests = Object.assign({}, state.requests, {
        [action.id]: {
          message: state.requests[action.id].message,
          data: action.data,
          start: state.requests[action.id].start,
          end: action.end,
        },
      });
      const error = state.error.concat(action.id);
      console.error('network_error:', action.data);
      const pending = state.pending.filter((id) => id !== action.id);
      return Object.assign({}, state, { requests, pending, error });
    }

    case FREE_NETWORK_REQUESTS: {
      const { size } = action;
      const success =
        state.success.length > size ? [].concat(state.success) : state.success;
      const error =
        state.error.length > size ? [].concat(state.error) : state.error;
      const requests = Object.assign({}, state.requests);
      while (success.length > size) {
        delete requests[success.shift()];
      }
      while (error.length > size) {
        delete requests[error.shift()];
      }
      return Object.assign({}, state, { requests, success, error });
    }

    case 'RESET_VISUALIZER_STATE': {
      return initialState;
    }

    case PROGRESS_UPDATE: {
      const { text, progress } = action;
      if (progress === 0) {
        return Object.assign({}, state, { progress: '' });
      }
      return Object.assign({}, state, { progress: `${progress}% - ${text}` });
    }

    default:
      return state;
  }
}

// --- Action Creators --------------------------------------------------------

// --- Pure actions ---

export function createRequest(message = 'no description') {
  const id = `${uniqueRequestId}`;
  uniqueRequestId += 1;
  return { type: NETWORK_REQUEST, id, message, start: now() };
}

export function success(id, data = {}) {
  return { type: NETWORK_SUCCESS, id, data, end: now() };
}

export function error(id, data = {}) {
  return { type: NETWORK_ERROR, id, data, end: now() };
}

export function freeNetworkRequests(size = 10) {
  return { type: FREE_NETWORK_REQUESTS, size };
}

export function updateProgress({ text, progress }) {
  return { type: PROGRESS_UPDATE, text, progress };
}

export function resetProgress() {
  return { type: PROGRESS_UPDATE, text: '', progress: 0 };
}
