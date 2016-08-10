// --- Action types -----------------------------------------------------------

const ACTIVATE_OBJECT = 'ACTIVATE_OBJECT';

export const TYPE_SOURCE = 'source';
export const TYPE_REPRESENTATION = 'representation';
export const TYPE_VIEW = 'view';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  source: null,
  representation: null,
  view: '-1',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIVATE_OBJECT: {
      return Object.assign({}, state, { [action.name]: action.id });
    }

    case 'RESET_VISUALIZER_STATE': {
      return initialState;
    }

    default:
      return state;
  }
}

// --- Action Creators --------------------------------------------------------

export function activate(id, name) {
  return { type: ACTIVATE_OBJECT, name, id };
}
