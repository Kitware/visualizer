import { createSelector } from 'reselect';
import { getRootState } from '..';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPendingRequests = state => getRootState(state).network.pending;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getPendingCount = createSelector(
  [getPendingRequests],
  (pending) => pending.length
);

