import actions from './redux/actions';

// ----------------------------------------------------------------------------
// Debug helper
// ----------------------------------------------------------------------------

const NETWORK_QUEUE_SIZE = 10;

export function networkDebugTime(req) {
  console.log(req.message, req.end - req.start);
}

export function networkDebugData(req) {
  console.log(req.message, req.data);
}

// ----------------------------------------------------------------------------
// State handling
// ----------------------------------------------------------------------------

const debugNetwork = null; // networkDebugTime;
const batchDispatchQueue = [];
const previousState = {
  netSuccess: 0,
  netError: 0,
  needResetCamera: true,
};

// ----------------------------------------------------------------------------
// Dispatch processing in batch mode
// ----------------------------------------------------------------------------

function addToDispatchQueue(action) {
  batchDispatchQueue.push(action);
}

function batchDispatch(dispatch) {
  while (batchDispatchQueue.length) {
    dispatch(batchDispatchQueue.shift());
  }
}

// ----------------------------------------------------------------------------
// Helper methods
// ----------------------------------------------------------------------------

function findSourceRepresentation(state, sourceId) {
  const sourceProxy = state.proxies.pipeline.sources.find(
    (item) => item.id === sourceId
  );
  if (sourceProxy) {
    return sourceProxy.rep;
  }
  return null;
}

function representationHasScalarImage(state, repId) {
  if (!repId) {
    return false;
  }
  const repProxy = state.proxies.proxies[repId];
  if (!repProxy) {
    return false;
  }
  if (repProxy.colorBy.mode !== 'array') {
    return false;
  }
  const array = repProxy.colorBy.array[1];
  if (array && array.length) {
    return true;
  }
  return false;
}

// ----------------------------------------------------------------------------
// Behavior
// ----------------------------------------------------------------------------

export default function onChange(state, dispatch) {
  if (batchDispatchQueue.length) {
    return;
  }

  // Fetch active proxy
  if (state.active.source !== previousState.activeSource) {
    previousState.activeSource = state.active.source;
    if (previousState.activeSource && previousState.activeSource !== '0') {
      previousState.activeRepesentation = null;
      addToDispatchQueue(
        actions.proxies.fetchProxy(previousState.activeSource)
      );
    }
  }

  // Fetch associated representation + color map if need update
  const activeRep = findSourceRepresentation(state, previousState.activeSource);
  if (activeRep && previousState.activeRepesentation !== activeRep) {
    previousState.activeRepesentation = activeRep;
    addToDispatchQueue(actions.proxies.fetchProxy(activeRep));
  }

  if (
    representationHasScalarImage(state, activeRep) &&
    previousState.lastImageRequest !== activeRep
  ) {
    previousState.lastImageRequest = activeRep;
    addToDispatchQueue(actions.colors.fetchRepresentationColorMap(activeRep));
    addToDispatchQueue(
      actions.colors.fetchLookupTableScalarRange(previousState.activeSource)
    );
    // Fetch opacity points of active array if not available
    if (state.proxies.proxies[activeRep].colorBy.array[1]) {
      addToDispatchQueue(
        actions.colors.fetchOpacityPoints(
          state.proxies.proxies[activeRep].colorBy.array[1]
        )
      );
    }
  }

  // Update DataSet file extension base on its type
  const activeSource = state.proxies.proxies[previousState.activeSource];
  if (
    activeSource &&
    activeSource.data.type !== previousState.activeDataSetType
  ) {
    previousState.activeDataSetType = activeSource.data.type;
    addToDispatchQueue(
      actions.save.updateDatasetFilename(previousState.activeDataSetType)
    );
  }

  // Fetch view proxy if not available
  if (previousState.view !== state.proxies.pipeline.view) {
    previousState.view = state.proxies.pipeline.view;
    addToDispatchQueue(actions.proxies.fetchProxy(previousState.view));
  }

  if (debugNetwork) {
    // Print network success calls
    if (previousState.netSuccess < state.network.success.length) {
      for (
        let i = previousState.netSuccess;
        i < state.network.success.length;
        i++
      ) {
        debugNetwork(state.network.requests[state.network.success[i]]);
      }
      previousState.netSuccess = state.network.success.length;
    }

    // Print network error calls
    if (previousState.netError < state.network.error.length) {
      for (
        let i = previousState.netError;
        i < state.network.error.length;
        i++
      ) {
        debugNetwork(state.network.requests[state.network.error[i]]);
      }
      previousState.netError = state.network.error.length;
    }
  }

  // First source in pipeline should trigger resetCamera
  if (
    previousState.needResetCamera &&
    state.proxies.pipeline.sources.length === 1
  ) {
    previousState.needResetCamera = false;
    addToDispatchQueue(actions.view.resetCamera());
  }

  // Keep only a moving window of the network requests
  if (
    state.network.success.length > NETWORK_QUEUE_SIZE ||
    state.network.error.length > NETWORK_QUEUE_SIZE
  ) {
    previousState.netSuccess -=
      state.network.success.length > NETWORK_QUEUE_SIZE
        ? state.network.success.length - NETWORK_QUEUE_SIZE
        : 0;
    previousState.netError -=
      state.network.error.length > NETWORK_QUEUE_SIZE
        ? state.network.error.length - NETWORK_QUEUE_SIZE
        : 0;
    addToDispatchQueue(actions.network.freeNetworkRequests(NETWORK_QUEUE_SIZE));
  }

  batchDispatch(dispatch);
}
