import { createSelector } from 'reselect';
import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPendingRequests = (state) => access(state).network.pending;

export const getProgressUpdate = (state) => access(state).network.progress;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getPendingCount = createSelector(
  [getPendingRequests],
  (pending) => pending.length
);
