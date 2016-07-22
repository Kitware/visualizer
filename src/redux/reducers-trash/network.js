import * as Actions from '../actions/network';

export const initialState = {
  requests: {},
  pending: [],
  success: [],
  error: [],
};

export default function networkReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.NETWORK_REQUEST: {
      const requests = Object.assign({}, state.requests,
        { [action.id]: { message: action.message, start: action.start } });
      const pending = state.pending.concat(action.id);
      return Object.assign({}, state, { requests, pending });
    }

    case Actions.NETWORK_SUCCESS: {
      if (!state.requests[action.id]) {
        console.error('no request for', action.id, action.data);
      }
      const requests = Object.assign({}, state.requests,
        {
          [action.id]: {
            message: state.requests[action.id].message,
            data: action.data,
            start: state.requests[action.id].start,
            end: action.end,
          },
        });
      const success = state.success.concat(action.id);
      const pending = state.pending.filter(id => id !== action.id);
      return Object.assign({}, state, { requests, pending, success });
    }

    case Actions.NETWORK_ERROR: {
      if (!state.requests[action.id]) {
        console.error('no request for', action.id, action.data);
      }
      const requests = Object.assign({}, state.requests,
        {
          [action.id]: {
            message: state.requests[action.id].message,
            data: action.data,
            start: state.requests[action.id].start,
            end: action.end,
          },
        });
      const error = state.error.concat(action.id);
      const pending = state.pending.filter(id => id !== action.id);
      return Object.assign({}, state, { requests, pending, error });
    }

    case Actions.FREE_NETWORK_REQUESTS: {
      const size = action.size;
      const success = state.success.length > size ? [].concat(state.success) : state.success;
      const error = state.error.length > size ? [].concat(state.error) : state.error;
      const requests = Object.assign({}, state.requests);
      while (success.length > size) {
        delete requests[success.shift()];
      }
      while (error.length > size) {
        delete requests[error.shift()];
      }
      return Object.assign({}, state, { requests, success, error });
    }

    default:
      return state;
  }
}
