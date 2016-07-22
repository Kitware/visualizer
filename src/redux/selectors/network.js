import { createSelector } from 'reselect';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPendingRequests = state => state.network.pending;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getPendingCount = createSelector(
  [getPendingRequests],
  (pending) => pending.length
);

