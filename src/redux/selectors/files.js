import { createSelector } from 'reselect';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getActivePath = state => state.files.activePath;
export const getFileListings = state => state.files.listings;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getFileListing = createSelector(
  [getActivePath, getFileListings],
  (id, map) => map[id]
);
