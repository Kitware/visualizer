import * as Actions from '../actions/colors';

export const initialState = {
  images: {},
  scalarBars: {},
  presets: {},
  presetImages: {},
  ranges: {},
  piecewiseFunctions: {},
  piecewiseFunctionsToPush: {},
};

export default function proxiesReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.LOOKUP_TABLE_IMAGE_STORE: {
      const images = Object.assign({}, state.images, { [action.id]: action.image });
      return Object.assign({}, state, { images });
    }

    case Actions.SCALAR_BAR_VISIBILITY: {
      const scalarBars = Object.assign({}, state.scalarBars, action.state);
      return Object.assign({}, state, { scalarBars });
    }

    case Actions.APPLY_PRESET: {
      const presets = Object.assign({}, state.presets, { [action.id]: action.name });
      if (state.presetImages[action.name]) {
        const images = Object.assign({}, state.images, { [action.id]: state.presetImages[action.name] });
        return Object.assign({}, state, { presets, images });
      }
      return Object.assign({}, state, { presets });
    }

    case Actions.ALL_PRESETS: {
      const presetImages = action.presetImages;
      return Object.assign({}, state, { presetImages });
    }

    case Actions.LUT_RANGE: {
      const ranges = Object.assign({}, state.ranges, { [action.id]: action.range });
      return Object.assign({}, state, { ranges });
    }

    case Actions.UPDATE_PIECE_WISE_FUNCTION: {
      const piecewiseFunctions = Object.assign({}, state.piecewiseFunctions, { [action.arrayName]: action.points });
      if (action.serverSidePointsFormat) {
        const piecewiseFunctionsToPush = Object.assign({}, state.piecewiseFunctionsToPush, { [action.arrayName]: action.serverSidePointsFormat });
        return Object.assign({}, state, { piecewiseFunctions, piecewiseFunctionsToPush });
      }
      return Object.assign({}, state, { piecewiseFunctions });
    }

    case Actions.REMOVE_SERVER_PIECE_WISE_FUNCTION: {
      const piecewiseFunctionsToPush = Object.assign({}, state.piecewiseFunctionsToPush);
      action.arrayNames.forEach(name => {
        delete piecewiseFunctionsToPush[name];
      });
      return Object.assign({}, state, { piecewiseFunctionsToPush });
    }

    default:
      return state;
  }
}
