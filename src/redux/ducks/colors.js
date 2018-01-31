import network from '../../network';
import * as netActions from './network';
import * as proxiesActions from './proxies';
import localPresetImages from '../../presets.json';

const externalActions = {
  network: netActions,
  proxies: proxiesActions,
};

// --- Action types -----------------------------------------------------------

const LOOKUP_TABLE_IMAGE_STORE = 'LOOKUP_TABLE_IMAGE_STORE';
const SCALAR_BAR_VISIBILITY = 'SCALAR_BAR_VISIBILITY';
const APPLY_PRESET = 'APPLY_PRESET';
const ALL_PRESETS = 'ALL_PRESETS';
const LUT_RANGE = 'LUT_RANGE';
const UPDATE_PIECE_WISE_FUNCTION = 'UPDATE_PIECE_WISE_FUNCTION';
const UPDATE_PIECE_WISE_GUASSIANS = 'UPDATE_PIECE_WISE_GUASSIANS';
const REMOVE_SERVER_PIECE_WISE_FUNCTION = 'REMOVE_SERVER_PIECE_WISE_FUNCTION';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  images: {},
  scalarBars: {},
  presets: {},
  presetImages: {},
  ranges: {},
  piecewiseFunctions: {},
  piecewiseFunctionsToPush: {},
  piecewiseGaussians: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOOKUP_TABLE_IMAGE_STORE: {
      const images = Object.assign({}, state.images, {
        [action.id]: action.image,
      });
      return Object.assign({}, state, { images });
    }

    case SCALAR_BAR_VISIBILITY: {
      const scalarBars = Object.assign({}, state.scalarBars, action.state);
      return Object.assign({}, state, { scalarBars });
    }

    case APPLY_PRESET: {
      const presets = Object.assign({}, state.presets, {
        [action.id]: action.name,
      });
      if (state.presetImages[action.name]) {
        const images = Object.assign({}, state.images, {
          [action.id]: state.presetImages[action.name],
        });
        return Object.assign({}, state, { presets, images });
      }
      return Object.assign({}, state, { presets });
    }

    case ALL_PRESETS: {
      const { presetImages } = action;
      return Object.assign({}, state, { presetImages });
    }

    case LUT_RANGE: {
      const ranges = Object.assign({}, state.ranges, {
        [action.id]: action.range,
      });
      return Object.assign({}, state, { ranges });
    }

    case UPDATE_PIECE_WISE_FUNCTION: {
      const piecewiseFunctions = Object.assign({}, state.piecewiseFunctions, {
        [action.arrayName]: action.points,
      });
      if (action.serverSidePointsFormat) {
        const piecewiseFunctionsToPush = Object.assign(
          {},
          state.piecewiseFunctionsToPush,
          { [action.arrayName]: action.serverSidePointsFormat }
        );
        return Object.assign({}, state, {
          piecewiseFunctions,
          piecewiseFunctionsToPush,
        });
      }
      return Object.assign({}, state, { piecewiseFunctions });
    }

    case UPDATE_PIECE_WISE_GUASSIANS: {
      const piecewiseGaussians = Object.assign({}, state.piecewiseGaussians, {
        [action.arrayName]: action.gaussians,
      });
      return Object.assign({}, state, { piecewiseGaussians });
    }

    case REMOVE_SERVER_PIECE_WISE_FUNCTION: {
      const piecewiseFunctionsToPush = Object.assign(
        {},
        state.piecewiseFunctionsToPush
      );
      action.arrayNames.forEach((name) => {
        delete piecewiseFunctionsToPush[name];
      });
      return Object.assign({}, state, { piecewiseFunctionsToPush });
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

export function storeLookupTableImage(representationId, encodedImage) {
  return {
    type: LOOKUP_TABLE_IMAGE_STORE,
    id: representationId,
    image: encodedImage,
  };
}

export function storeScalarBarVisibilies(state) {
  return { type: SCALAR_BAR_VISIBILITY, state };
}

export function storePresetMapping(representationId, name) {
  return { type: APPLY_PRESET, id: representationId, name };
}

export function storePresetImages(presetImages) {
  return { type: ALL_PRESETS, presetImages };
}

export function storeLookupTableRange(sourceId, range) {
  return { type: LUT_RANGE, id: sourceId, range };
}

export function storePiecewiseFunction(
  arrayName,
  points,
  serverSidePointsFormat
) {
  return {
    type: UPDATE_PIECE_WISE_FUNCTION,
    arrayName,
    points,
    serverSidePointsFormat,
  };
}

export function storeGuassians(arrayName, gaussians) {
  return { type: UPDATE_PIECE_WISE_GUASSIANS, arrayName, gaussians };
}

export function removePendingServerOpacityPoints(arrayNames) {
  return { type: REMOVE_SERVER_PIECE_WISE_FUNCTION, arrayNames };
}

// --- Async actions ---

export function fetchRepresentationColorMap(representationId, sampling = 512) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Fetch color map image'
    );
    network
      .getClient()
      .ColorManager.getLutImage(representationId, sampling)
      .then(
        (ok) => {
          dispatch(externalActions.network.success(netRequest.id, ok));
          dispatch(storeLookupTableImage(representationId, ok.image));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function applyColorBy(
  representationId,
  colorMode,
  arrayLocation = 'POINTS',
  arrayName = '',
  vectorComponent = 0,
  vectorMode = 'Magnitude',
  rescale = false
) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      `Color by ${arrayName}`
    );
    network
      .getClient()
      .ColorManager.colorBy(
        representationId,
        colorMode,
        arrayLocation,
        arrayName,
        vectorMode,
        vectorComponent,
        rescale
      )
      .then(
        (ok) => {
          dispatch(externalActions.network.success(netRequest.id, ok));
          dispatch(externalActions.proxies.fetchProxy(representationId));
          dispatch(fetchRepresentationColorMap(representationId));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function showScalarBar(sourceId, show) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Toggle scalar bar'
    );
    network
      .getClient()
      .ColorManager.setScalarBarVisibilities({ [sourceId]: show })
      .then(
        (ok) => {
          dispatch(externalActions.network.success(netRequest.id, ok));
          dispatch(storeScalarBarVisibilies(ok));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function applyPreset(representationId, presetName) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      `Apply preset ${presetName}`
    );
    network
      .getClient()
      .ColorManager.selectColorMap(representationId, presetName)
      .then(
        (ok) => {
          dispatch(externalActions.network.success(netRequest.id, ok));
          dispatch(storePresetMapping(representationId, presetName));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function fetchColorMapImages(sampling = 512, local = true) {
  return (dispatch) => {
    if (local) {
      // Warning - categorical color maps which are constant from 0-1 have been removed manually.
      // If the file must be re-generated, these colormaps should be removed again.
      return storePresetImages(localPresetImages);
    }

    const netRequest = externalActions.network.createRequest(
      'Fetch all preset images'
    );
    network
      .getClient()
      .ColorManager.listColorMapImages(sampling)
      .then(
        (presetImages) => {
          // Useful to update local presets
          // console.log(JSON.stringify(presetImages));
          dispatch(
            externalActions.network.success(netRequest.id, presetImages)
          );
          dispatch(storePresetImages(presetImages));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function rescaleTransferFunction(options) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Fetch all preset images'
    );
    network
      .getClient()
      .ColorManager.rescaleTransferFunction(options)
      .then(
        (ok) => {
          dispatch(externalActions.network.success(netRequest.id, ok));
          // FIXME get repId instead of sourceId
          // dispatch(storeLookupTableRange(options.proxyId, ok.range));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function fetchLookupTableScalarRange(sourceProxyId) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Fetch lookup table range'
    );
    network
      .getClient()
      .ColorManager.getCurrentScalarRange(sourceProxyId)
      .then(
        (range) => {
          dispatch(externalActions.network.success(netRequest.id, range));
          dispatch(storeLookupTableRange(sourceProxyId, range));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function applyOpacityPoints(arrayName, points) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Apply piecewise opacity function'
    );
    network
      .getClient()
      .ColorManager.setOpacityFunctionPoints(arrayName, points, true)
      .then(
        (nothing) => {
          dispatch(externalActions.network.success(netRequest.id));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function fetchOpacityPoints(arrayName) {
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Fetch piecewise opacity function'
    );
    network
      .getClient()
      .ColorManager.getOpacityFunctionPoints(arrayName)
      .then(
        (piecewise) => {
          dispatch(externalActions.network.success(netRequest.id, piecewise));
          dispatch(storePiecewiseFunction(arrayName, piecewise));
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function pushPendingServerOpacityPoints() {
  return (dispatch, getState) => {
    const map = getState().colors.piecewiseFunctionsToPush;
    const arrayNames = Object.keys(map);
    arrayNames.forEach((name) => {
      dispatch(applyOpacityPoints(name, map[name]));
    });
    return removePendingServerOpacityPoints(arrayNames);
  };
}
