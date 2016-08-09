import { getRootState } from '..';
import { createSelector } from 'reselect';

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

