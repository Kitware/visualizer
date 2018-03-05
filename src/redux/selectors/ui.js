import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getCollapsableState = (state) => access(state).ui.collapsableState;
export const getGroupCollapsedState = (state) =>
  access(state).ui.collapsableState.collapsibleGroups;
export const getVisiblePanel = (state) => access(state).ui.visiblePanel;
