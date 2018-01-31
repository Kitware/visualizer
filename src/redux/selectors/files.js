import { createSelector } from 'reselect';
import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getActivePath = (state) => access(state).files.activePath;
export const getFileListings = (state) => access(state).files.listings;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getFileListing = createSelector(
  [getActivePath, getFileListings],
  (id, map) => map[id]
);
