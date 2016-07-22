import * as Actions from '../actions/time';

export const initialState = {
  index: -1,
  values: [],
  playing: false,
};

export default function timeReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.TIME_STORE: {
      let { index, values } = action;
      values = values || state.values;
      index = index % values.length;
      return Object.assign({}, state, { index, values });
    }

    case Actions.TIME_ANIMATION_STORE: {
      return Object.assign({}, state, { playing: !!action.play });
    }

    default:
      return state;
  }
}
