import { getRootState } from '..';
import { createSelector } from 'reselect';

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
