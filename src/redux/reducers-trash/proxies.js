import * as Actions from '../actions/proxies';

export const initialState = {
  proxies: {},
  pipeline: {
    sources: [],
  },
  sourceToRepresentation: {},
  settings: {},
  available: {
    sources: [],
    filters: [],
  },
};

function propertyKey(prop) {
  return [prop.id, prop.name].join(':');
}

export default function proxiesReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.PROXY_STORE: {
      const proxy = action.proxy;
      const proxies = Object.assign({}, state.proxies, { [proxy.id]: proxy });
      return Object.assign({}, state, { proxies });
    }

    case Actions.PIPELINE_STORE: {
      const pipeline = action.pipeline;
      const sourceToRepresentation = {};
      pipeline.sources.forEach(proxy => {
        sourceToRepresentation[proxy.id] = proxy.rep;
      });
      return Object.assign({}, state, { pipeline, sourceToRepresentation });
    }

    case Actions.PROXY_SETTING_STORE: {
      const settings = Object.assign({}, state.settings, { [action.name]: action.id });
      return Object.assign({}, state, { settings });
    }

    case Actions.AVAILABLE_SOURCES_STORE:
    case Actions.AVAILABLE_FILTERS_STORE: {
      const available = Object.assign({}, state.available, { [action.key]: action[action.key] });
      return Object.assign({}, state, { available });
    }

    case Actions.UPDATE_PROPERTIES: {
      const changeMap = {};
      action.properties.forEach(prop => {
        changeMap[propertyKey(prop)] = prop;
      });

      const proxies = Object.assign({}, state.proxies);
      action.proxies.forEach(id => {
        const proxProps = proxies[id].properties;
        if (proxProps) {
          const properties = proxProps.map(prop => changeMap[propertyKey(prop)] || prop);
          proxies[id] = Object.assign({}, proxies[id], { properties });
        }
      });
      return Object.assign({}, state, { proxies });
    }

    default:
      return state;
  }
}
