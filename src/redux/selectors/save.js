import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPaths = (state) => access(state).save.paths;
export const getStatuses = (state) => access(state).save.statuses;
