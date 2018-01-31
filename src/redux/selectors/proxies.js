import { createSelector } from 'reselect';
import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Convenience methods to traverse through a proxies property and ui arrays
// to update the collapsed state of the various collapsible groups that may be
// present.
// ----------------------------------------------------------------------------

function checkPropertyList(propList, uiList, groupCollapseState) {
  propList.forEach((prop, idx) => {
    const ui = uiList[idx];
    const id = [prop.id, prop.name].join(':');
    if (id in groupCollapseState) {
      prop.value = !groupCollapseState[id];
    }

    if (prop.children) {
      checkPropertyList(prop.children, ui.children, groupCollapseState);
    }
  });
}

function decorateCollapsibleGroups(proxy, groupCollapseState) {
  checkPropertyList(proxy.properties, proxy.ui, groupCollapseState);
  return proxy;
}

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const hasSource = (state) =>
  access(state).active.source && access(state).active.source !== '0';

export const getActiveSourceId = (state) => access(state).active.source;
export const getProxyMapById = (state) => access(state).proxies.proxies;
export const getPipeline = (state) => access(state).proxies.pipeline;
export const getSourceToRepresentationMap = (state) =>
  access(state).proxies.sourceToRepresentation;
export const getActiveViewId = (state) => access(state).proxies.pipeline.view;

export const getAvailableSources = (state) =>
  access(state).proxies.available.sources;
export const getAvailableFilters = (state) =>
  access(state).proxies.available.filters;

export const getCollapseState = (state) =>
  access(state).ui.collapsableState.collapsibleGroups;
export const isSourceCollapsed = (state) =>
  access(state).ui.collapsableState.Source;
export const isRepresentationCollapsed = (state) =>
  access(state).ui.collapsableState.Representation;
export const isViewCollapsed = (state) =>
  access(state).ui.collapsableState.View;
export const isRenderViewSettingsCollapsed = (state) =>
  access(state).ui.collapsableState['Global Settings'];

export const getRenderViewSettingsProxyId = (state) =>
  access(state).proxies.settings.RenderViewSettings;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getActiveSource = createSelector(
  [getActiveSourceId, getProxyMapById],
  (sourceId, proxyMapById) =>
    sourceId && proxyMapById ? proxyMapById[sourceId] : undefined
);

export const getActiveRepresentationId = createSelector(
  [getActiveSourceId, getSourceToRepresentationMap],
  (sourceId, sourceToRepresentation) =>
    sourceId && sourceToRepresentation
      ? sourceToRepresentation[sourceId]
      : undefined
);

export const getActiveRepresentation = createSelector(
  [getActiveRepresentationId, getProxyMapById],
  (id, proxyMapById) => (id && proxyMapById ? proxyMapById[id] : undefined)
);

export const getActiveView = createSelector(
  [getActiveViewId, getProxyMapById],
  (viewId, proxyMapById) =>
    viewId && proxyMapById ? proxyMapById[viewId] : undefined
);

export const getRenderViewSettingsProxy = createSelector(
  [getRenderViewSettingsProxyId, getProxyMapById],
  (id, map) => (map ? map[id] : undefined)
);

export const getRenderViewSettingsPropertyGroup = createSelector(
  [getRenderViewSettingsProxy, isRenderViewSettingsCollapsed, getCollapseState],
  (proxy, collapsed, groupState) =>
    proxy
      ? Object.assign(
          { name: 'Global Settings', collapsed },
          decorateCollapsibleGroups(proxy, groupState)
        )
      : undefined
);

export const getSourcePropertyGroup = createSelector(
  [getActiveSource, isSourceCollapsed, getCollapseState],
  (proxy, collapsed, groupState) =>
    proxy
      ? Object.assign(
          { name: 'Source', collapsed },
          decorateCollapsibleGroups(proxy, groupState)
        )
      : undefined
);

export const getRepresentationPropertyGroup = createSelector(
  [getActiveRepresentation, isRepresentationCollapsed, getCollapseState],
  (proxy, collapsed, groupState) =>
    proxy
      ? Object.assign(
          { name: 'Representation', collapsed },
          decorateCollapsibleGroups(proxy, groupState)
        )
      : undefined
);

export const getViewPropertyGroup = createSelector(
  [getActiveView, isViewCollapsed, getCollapseState],
  (proxy, collapsed, groupState) =>
    proxy
      ? Object.assign(
          { name: 'View', collapsed },
          decorateCollapsibleGroups(proxy, groupState)
        )
      : undefined
);

export const getAvailableList = createSelector(
  [getAvailableSources, getAvailableFilters, hasSource],
  (sources, filters, addFilter) => {
    const list = sources.map((name) => ({ name, icon: 'source' }));
    if (addFilter) {
      return list.concat(filters.map((name) => ({ name, icon: 'filter' })));
    }
    return list;
  }
);
