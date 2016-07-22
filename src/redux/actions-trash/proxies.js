import network from '../../network';
import * as netActions from './network';
import * as timeActions from './time';
import * as activeActions from './active';

// --- Action types ---

export const PROXY_STORE = 'PROXY_STORE';
export const PROXY_SETTING_STORE = 'PROXY_SETTING_STORE';
export const PIPELINE_STORE = 'PIPELINE_STORE';
export const AVAILABLE_SOURCES_STORE = 'AVAILABLE_SOURCES_STORE';
export const AVAILABLE_FILTERS_STORE = 'AVAILABLE_FILTERS_STORE';
export const UPDATE_PROPERTIES = 'UPDATE_PROPERTIES';

// --- Pure actions ---

export function storeProxy(proxy) {
  return { type: PROXY_STORE, proxy };
}

export function storeSettingProxy(name, id) {
  return { type: PROXY_SETTING_STORE, name, id };
}

export function storePipeline(pipeline) {
  return { type: PIPELINE_STORE, pipeline };
}

export function storeAvailableSources(sources) {
  return { type: AVAILABLE_SOURCES_STORE, sources, key: 'sources' };
}

export function storeAvailableFilters(filters) {
  return { type: AVAILABLE_FILTERS_STORE, filters, key: 'filters' };
}

export function updateProxyProperties(proxies, properties) {
  return { type: UPDATE_PROPERTIES, proxies, properties };
}

// --- Async actions ---

export function fetchPipeline() {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch pipeline');
    network.getClient().ProxyManager.list()
      .then(
        pipeline => {
          dispatch(netActions.success(netRequest.id, pipeline));
          dispatch(storePipeline(pipeline));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function createProxy(name, parentProxy) {
  return dispatch => {
    const netRequest = netActions.createRequest(`Create proxy ${name}`);
    network.getClient().ProxyManager
      .create(name, parentProxy)
      .then(
        proxy => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
          dispatch(activeActions.activate(proxy.id, activeActions.TYPE_SOURCE));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });

    return netRequest;
  };
}

export function deleteProxy(proxyId) {
  return dispatch => {
    const netRequest = netActions.createRequest(`Delete proxy ${proxyId}`);
    network.getClient().ProxyManager.delete(proxyId)
      .then(
        parent => {
          dispatch(netActions.success(netRequest.id, parent));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
          dispatch(activeActions.activate(parent.id, 'source'));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function fetchProxy(proxyId) {
  return dispatch => {
    const needUI = true; // FIXME
    const netRequest = netActions.createRequest(`Fetch proxy ${proxyId}`);
    network.getClient().ProxyManager.get(proxyId, needUI)
      .then(
        proxy => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

// Another possible one 'RenderViewInteractionSettings'
export function fetchSettingProxy(name = 'RenderViewSettings') {
  return dispatch => {
    const netRequest = netActions.createRequest(`Fetch setting proxy ${name}`);
    network.getClient().ProxyManager.findProxyId('settings', name)
      .then(
        proxyId => {
          dispatch(netActions.success(netRequest.id, proxyId));
          dispatch(storeSettingProxy(name, proxyId));
          dispatch(fetchProxy(proxyId));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function fetchAvailableProxies() {
  return dispatch => {
    // Sources
    const netRequest = netActions.createRequest('Fetch available sources');
    network.getClient().ProxyManager.availableSources()
      .then(
        sources => {
          dispatch(netActions.success(netRequest.id, sources));
          dispatch(storeAvailableSources(sources));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });

    // Filters
    const netFilterRequest = netActions.createRequest('Fetch available filters');
    dispatch(netFilterRequest);
    network.getClient().ProxyManager.availableFilters()
      .then(
        filters => {
          dispatch(netActions.success(netFilterRequest.id, filters));
          dispatch(storeAvailableFilters(filters));
        },
        err => {
          dispatch(netActions.error(netFilterRequest.id, err));
        });
    return netRequest;
  };
}

export function applyChangeSet(propertyChangeSet, propsOwners = []) {
  return dispatch => {
    const netRequest = netActions.createRequest('Apply property edits');
    network.getClient().ProxyManager.update(propertyChangeSet)
      .then(
        resp => {
          dispatch(netActions.success(netRequest.id, resp));
          dispatch(updateProxyProperties(propsOwners, propertyChangeSet));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}

export function openFiles(files) {
  return dispatch => {
    const netRequest = netActions.createRequest(`Open files ${files}`);
    network.getClient()
      .ProxyManager
      .open(files)
      .then(
        req => {
          if (req.success) {
            dispatch(netActions.success(netRequest.id, req));
            // dispatch(fetchProxy(req.id)); // => new active fetch...
            dispatch(activeActions.activate(req.id, activeActions.TYPE_SOURCE));
            dispatch(fetchPipeline());
            dispatch(timeActions.fetchTime());
          } else {
            dispatch(netActions.error(netRequest.id, req));
          }
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });
    return netRequest;
  };
}
