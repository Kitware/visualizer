import * as Actions from '../actions/active';

export const initialState = {
  source: null,
  representation: null,
  view: '-1',
};

export default function activeReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.ACTIVATE_OBJECT: {
      return Object.assign({}, state, { [action.name]: action.id });
    }

    default:
      return state;
  }
}
