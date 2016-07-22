import * as Actions from '../actions/files';

export const initialState = {
  listings: {},
  activePath: '.',
};

export default function filesReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.DIRECTORY_STORE: {
      const { path, listing } = action;
      const listings = Object.assign({}, state.listings, { [path]: listing });
      return Object.assign({}, state, { listings });
    }

    case Actions.RESET_DIRECTORY_STORE: {
      return {};
    }

    case Actions.ACTIVE_DIRECTORY: {
      const activePath = action.activePath;
      return Object.assign({}, state, { activePath });
    }

    default:
      return state;
  }
}
