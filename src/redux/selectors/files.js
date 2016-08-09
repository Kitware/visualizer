import { createSelector } from 'reselect';
import { getRootState } from '..';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getActivePath = state => getRootState(state).files.activePath;
export const getFileListings = state => getRootState(state).files.listings;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getFileListing = createSelector(
  [getActivePath, getFileListings],
  (id, map) => map[id]
);
