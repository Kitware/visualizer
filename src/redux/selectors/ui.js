import { getRootState } from '..';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getCollapsableState = state => getRootState(state).ui.collapsableState;
export const getVisiblePanel = state => getRootState(state).ui.visiblePanel;
