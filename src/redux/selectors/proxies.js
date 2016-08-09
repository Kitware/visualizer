import { createSelector } from 'reselect';
import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const hasSource = state => access(state).active.source && access(state).active.source !== '0';

export const getActiveSourceId = state => access(state).active.source;
export const getProxyMapById = state => access(state).proxies.proxies;
export const getPipeline = state => access(state).proxies.pipeline;
export const getSourceToRepresentationMap = state => access(state).proxies.sourceToRepresentation;
export const getActiveViewId = state => access(state).proxies.pipeline.view;

export const getAvailableSources = state => access(state).proxies.available.sources;
export const getAvailableFilters = state => access(state).proxies.available.filters;

export const isSourceCollapsed = state => access(state).ui.collapsableState.Source;
export const isRepresentationCollapsed = state => access(state).ui.collapsableState.Representation;
export const isViewCollapsed = state => access(state).ui.collapsableState.View;
export const isRenderViewSettingsCollapsed = state => access(state).ui.collapsableState['Global Settings'];

export const getRenderViewSettingsProxyId = state => access(state).proxies.settings.RenderViewSettings;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getActiveSource = createSelector(
  [getActiveSourceId, getProxyMapById],
  (sourceId, proxyMapById) => ((sourceId && proxyMapById) ? proxyMapById[sourceId] : undefined)
);

export const getActiveRepresentationId = createSelector(
  [getActiveSourceId, getSourceToRepresentationMap],
  (sourceId, sourceToRepresentation) => ((sourceId && sourceToRepresentation) ? sourceToRepresentation[sourceId] : undefined)
);

export const getActiveRepresentation = createSelector(
  [getActiveRepresentationId, getProxyMapById],
  (id, proxyMapById) => ((id && proxyMapById) ? proxyMapById[id] : undefined)
);

export const getActiveView = createSelector(
  [getActiveViewId, getProxyMapById],
  (viewId, proxyMapById) => ((viewId && proxyMapById) ? proxyMapById[viewId] : undefined)
);

export const getRenderViewSettingsProxy = createSelector(
  [getRenderViewSettingsProxyId, getProxyMapById],
  (id, map) => (map ? map[id] : undefined)
);


export const getRenderViewSettingsPropertyGroup = createSelector(
  [getRenderViewSettingsProxy, isRenderViewSettingsCollapsed],
  (proxy, collapsed) => (proxy ? Object.assign({ name: 'Global Settings', collapsed }, proxy) : undefined)
);

export const getSourcePropertyGroup = createSelector(
  [getActiveSource, isSourceCollapsed],
  (proxy, collapsed) => (proxy ? Object.assign({ name: 'Source', collapsed }, proxy) : undefined)
);

export const getRepresentationPropertyGroup = createSelector(
  [getActiveRepresentation, isRepresentationCollapsed],
  (proxy, collapsed) => (proxy ? Object.assign({ name: 'Representation', collapsed }, proxy) : undefined)
);

export const getViewPropertyGroup = createSelector(
  [getActiveView, isViewCollapsed],
  (proxy, collapsed) => (proxy ? Object.assign({ name: 'View', collapsed }, proxy) : undefined)
);

export const getAvailableList = createSelector(
  [getAvailableSources, getAvailableFilters, hasSource],
  (sources, filters, addFilter) => {
    const list = sources.map(name => ({ name, icon: 'source' }));
    if (addFilter) {
      return list.concat(filters.map(name => ({ name, icon: 'filter' })));
    }
    return list;
  }
);
