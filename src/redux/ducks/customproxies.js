import * as netActions from './network';
import network from '../../network';
import * as activeActions from './active';
import * as timeActions from './time';
import * as colors from './colors';
import {
  applyChangeSet,
  fetchPipeline,
  storePipeline,
  storeProxy,
} from './proxies';

export function createClip(parentProxy) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Create proxy Clip');
    network
      .getClient()
      .ProxyManager.create('Clip', parentProxy)
      .then(
        (proxy) => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
          dispatch(activeActions.activate(proxy.id, activeActions.TYPE_SOURCE));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );

    return netRequest;
  };
}

export function createSlice(parentProxy) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Create proxy Slice');
    network
      .getClient()
      .ProxyManager.create('Slice', parentProxy)
      .then(
        (proxy) => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
          dispatch(activeActions.activate(proxy.id, activeActions.TYPE_SOURCE));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );

    return netRequest;
  };
}

export function showGaussianPoints(id) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Fetch pipeline');
    network
      .getClient()
      .ProxyManager.list()
      .then(
        (pipeline) => {
          dispatch(netActions.success(netRequest.id, pipeline));
          pipeline.sources.forEach((repObj) => {
            const idFromRep = repObj.id;
            if (id === idFromRep) {
              dispatch(
                applyChangeSet(
                  [
                    {
                      id: repObj.rep,
                      name: 'Representation',
                      value: 'Points',
                    },
                  ],
                  []
                )
              );
              dispatch(
                applyChangeSet(
                  [
                    {
                      id: idFromRep,
                      name: 'Resolution',
                      value: 120,
                    },
                  ],
                  []
                )
              );
            }
          });
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function createSlicedGeoemtry(name, parentProxy) {
  return (dispatch) => {
    const netRequest = netActions.createRequest(`Create proxy ${name}`);
    network
      .getClient()
      .ProxyManager.create(name, parentProxy)
      .then(
        (proxy) => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
          dispatch(activeActions.activate(proxy.id, activeActions.TYPE_SOURCE));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
          dispatch(showGaussianPoints(proxy.id));
          dispatch(createSlice(proxy.id));
          dispatch(createClip(proxy.id));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );

    return netRequest;
  };
}

export function updateClipCoordinates(proxyId, repId) {
  return (dispatch) => {
    const needUI = true;
    const netRequest = netActions.createRequest(`Fetch proxy ${proxyId}`);
    network
      .getClient()
      .ProxyManager.get(proxyId, needUI)
      .then(
        (proxy) => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
          proxy.properties.forEach((prop) => {
            if (prop.name === 'Box Parameters') {
              const propid = prop.id.replace(':Box Parameters', '');
              dispatch(
                applyChangeSet(
                  [
                    {
                      id: propid,
                      name: 'Bounds',
                      value: [
                        0.0001075,
                        0.0004875,
                        -0.00001501,
                        0.00036499,
                        -0.00001501,
                        0.00036499,
                      ],
                    },
                  ],
                  []
                )
              );
              dispatch(
                colors.applyColorBy(
                  repId,
                  'array',
                  'POINTS',
                  'DISPL',
                  'Magnitude',
                  0,
                  false
                )
              );
              dispatch(colors.applyPreset(repId, 'Rainbow Desaturated'));
            }
          });
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function applyCustomFilters(geometryId, clipId) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Fetch pipeline');
    network
      .getClient()
      .ProxyManager.list()
      .then(
        (pipeline) => {
          dispatch(netActions.success(netRequest.id, pipeline));
          dispatch(storePipeline(pipeline));
          pipeline.sources.forEach((repObj) => {
            const idFromRep = repObj.id;
            if (geometryId === idFromRep) {
              dispatch(
                applyChangeSet(
                  [
                    {
                      id: repObj.rep,
                      name: 'Representation',
                      value: 'Feature Edges',
                    },
                  ],
                  []
                )
              );
            } else if (clipId === idFromRep) {
              dispatch(
                applyChangeSet(
                  [
                    {
                      id: clipId,
                      name: 'ClipFunction',
                      value: 'Box',
                    },
                  ],
                  []
                )
              );
              dispatch(updateClipCoordinates(repObj.id, repObj.rep));
            }
          });
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export function createCustomBoxClip(parentProxy) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Create proxy Custom Clip');
    network
      .getClient()
      .ProxyManager.create('Clip', parentProxy)
      .then(
        (proxy) => {
          dispatch(netActions.success(netRequest.id, proxy));
          dispatch(storeProxy(proxy));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
          dispatch(applyCustomFilters(parentProxy, proxy.id));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );

    return netRequest;
  };
}

export function openCustomPlotFile(files) {
  return (dispatch) => {
    const netRequest = netActions.createRequest(`Open files ${files}`);
    network
      .getClient()
      .ProxyManager.open(files)
      .then(
        (req) => {
          if (req.success) {
            dispatch(netActions.success(netRequest.id, req));
            // dispatch(fetchProxy(req.id)); // => new active fetch...
            if (req.view) {
              // After opening a state file, we may get a new view id here
              dispatch(
                activeActions.activate(req.view, activeActions.TYPE_VIEW)
              );
            }
            dispatch(activeActions.activate(req.id, activeActions.TYPE_SOURCE));
            dispatch(fetchPipeline());
            dispatch(timeActions.fetchTime());
            dispatch(createCustomBoxClip(req.id));
          } else {
            dispatch(netActions.error(netRequest.id, req));
          }
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}

export async function deleteProxyCustom(proxyId, dispatch) {
  return new Promise((resolve, reject) => {
    const netRequest = netActions.createRequest(`Delete proxy ${proxyId}`);
    network
      .getClient()
      .ProxyManager.delete(proxyId)
      .then(
        (parent) => {
          dispatch(netActions.success(netRequest.id, parent));
          dispatch(fetchPipeline());
          dispatch(timeActions.fetchTime());
          resolve({ deleted: parent.success === 1, parent: parent.id });
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
          reject(err);
        }
      );
    dispatch(netRequest);
  });
}

export function fetchAllDeleteAndLoad(file) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Fetch pipeline');
    network
      .getClient()
      .ProxyManager.list()
      .then(
        (pipeline) => {
          dispatch(netActions.success(netRequest.id, pipeline));
          if (pipeline.sources.length > 0) {
            const sources = pipeline.sources.map((source) => source.id);
            sources.sort((a, b) => b - a);
            sources.reduce(async (previousPromise, source) => {
              await previousPromise;
              return deleteProxyCustom(source, dispatch);
            }, Promise.resolve());
          }
          dispatch(openCustomPlotFile([file]));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
        }
      );
    return netRequest;
  };
}
