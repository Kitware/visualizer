import { getRootState } from '..';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPaths = state => getRootState(state).save.paths;
export const getStatuses = state => getRootState(state).save.statuses;
