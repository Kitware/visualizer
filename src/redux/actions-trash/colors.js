import network from '../../network';
import * as netActions from './network';
import * as proxiesActions from './proxies';

// --- Action types ---

export const LOOKUP_TABLE_IMAGE_STORE = 'LOOKUP_TABLE_IMAGE_STORE';
export const SCALAR_BAR_VISIBILITY = 'SCALAR_BAR_VISIBILITY';
export const APPLY_PRESET = 'APPLY_PRESET';
export const ALL_PRESETS = 'ALL_PRESETS';
export const LUT_RANGE = 'LUT_RANGE';
export const UPDATE_PIECE_WISE_FUNCTION = 'UPDATE_PIECE_WISE_FUNCTION';
export const REMOVE_SERVER_PIECE_WISE_FUNCTION = 'REMOVE_SERVER_PIECE_WISE_FUNCTION';

// --- Pure actions ---

export function storeLookupTableImage(representationId, encodedImage) {
  return { type: LOOKUP_TABLE_IMAGE_STORE, id: representationId, image: encodedImage };
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

export function storePiecewiseFunction(arrayName, points, serverSidePointsFormat) {
  return { type: UPDATE_PIECE_WISE_FUNCTION, arrayName, points, serverSidePointsFormat };
}

export function removePendingServerOpacityPoints(arrayNames) {
  return { type: REMOVE_SERVER_PIECE_WISE_FUNCTION, arrayNames };
}

// --- Async actions ---

export function fetchRepresentationColorMap(representationId, sampling = 512) {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch color map image');
    network.getClient()
      .ColorManager
      .getLutImage(representationId, sampling)
      .then(
        ok => {
          dispatch(netActions.success(netRequest.id, ok));
          dispatch(storeLookupTableImage(representationId, ok.image));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function applyColorBy(representationId, colorMode, arrayLocation = 'POINTS', arrayName = '',
  vectorComponent = 0, vectorMode = 'Magnitude', rescale = false) {
  return dispatch => {
    const netRequest = netActions.createRequest(`Color by ${arrayName}`);
    network.getClient()
      .ColorManager
      .colorBy(representationId, colorMode, arrayLocation, arrayName, vectorMode, vectorComponent, rescale)
      .then(
        ok => {
          dispatch(netActions.success(netRequest.id, ok));
          dispatch(proxiesActions.fetchProxy(representationId));
          dispatch(fetchRepresentationColorMap(representationId));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function showScalarBar(sourceId, show) {
  return dispatch => {
    const netRequest = netActions.createRequest('Toggle scalar bar');
    network.getClient()
      .ColorManager
      .setScalarBarVisibilities({ [sourceId]: show })
      .then(
        ok => {
          dispatch(netActions.success(netRequest.id, ok));
          dispatch(storeScalarBarVisibilies(ok));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function applyPreset(representationId, presetName) {
  return dispatch => {
    const netRequest = netActions.createRequest(`Apply preset ${presetName}`);
    network.getClient()
      .ColorManager
      .selectColorMap(representationId, presetName)
      .then(
        ok => {
          dispatch(netActions.success(netRequest.id, ok));
          dispatch(storePresetMapping(representationId, presetName));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function fetchColorMapImages(sampling = 512) {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch all preset images');
    network.getClient()
      .ColorManager
      .listColorMapImages(sampling)
      .then(
        presetImages => {
          dispatch(netActions.success(netRequest.id, presetImages));
          dispatch(storePresetImages(presetImages));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function rescaleTransferFunction(options) {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch all preset images');
    network.getClient()
      .ColorManager
      .rescaleTransferFunction(options)
      .then(
        ok => {
          dispatch(netActions.success(netRequest.id, ok));
          // FIXME get repId instead of sourceId
          // dispatch(storeLookupTableRange(options.proxyId, ok.range));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function fetchLookupTableScalarRange(sourceProxyId) {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch lookup table range');
    network.getClient()
      .ColorManager
      .getCurrentScalarRange(sourceProxyId)
      .then(
        range => {
          dispatch(netActions.success(netRequest.id, range));
          dispatch(storeLookupTableRange(sourceProxyId, range));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function applyOpacityPoints(arrayName, points) {
  return dispatch => {
    const netRequest = netActions.createRequest('Apply piecewise opacity function');
    network.getClient()
      .ColorManager
      .setOpacityFunctionPoints(arrayName, points)
      .then(
        nothing => {
          dispatch(netActions.success(netRequest.id));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function fetchOpacityPoints(arrayName) {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch piecewise opacity function');
    network.getClient()
      .ColorManager
      .getOpacityFunctionPoints(arrayName)
      .then(
        piecewise => {
          dispatch(netActions.success(netRequest.id, piecewise));
          dispatch(storePiecewiseFunction(arrayName, piecewise));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function pushPendingServerOpacityPoints() {
  return (dispatch, getState) => {
    const map = getState().colors.piecewiseFunctionsToPush;
    const arrayNames = Object.keys(map);
    arrayNames.forEach(name => {
      dispatch(applyOpacityPoints(name, map[name]));
    });
    return removePendingServerOpacityPoints(arrayNames);
  };
}

