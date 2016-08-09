import { getRootState } from '..';
import { createSelector } from 'reselect';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const hasSource = state => getRootState(state).active.source && getRootState(state).active.source !== '0';

export const getActiveSourceId = state => getRootState(state).active.source;
export const getProxyMapById = state => getRootState(state).proxies.proxies;
export const getPipeline = state => getRootState(state).proxies.pipeline;
export const getSourceToRepresentationMap = state => getRootState(state).proxies.sourceToRepresentation;
export const getActiveViewId = state => getRootState(state).proxies.pipeline.view;

export const getAvailableSources = state => getRootState(state).proxies.available.sources;
export const getAvailableFilters = state => getRootState(state).proxies.available.filters;

export const isSourceCollapsed = state => getRootState(state).ui.collapsablegetRootState(state).Source;
export const isRepresentationCollapsed = state => getRootState(state).ui.collapsablegetRootState(state).Representation;
export const isViewCollapsed = state => getRootState(state).ui.collapsablegetRootState(state).View;
export const isRenderViewSettingsCollapsed = state => getRootState(state).ui.collapsableState['Global Settings'];

export const getRenderViewSettingsProxyId = state => getRootState(state).proxies.settings.RenderViewSettings;

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
