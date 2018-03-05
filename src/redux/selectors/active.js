import access from './stateAccessor';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getActiveView = (state) => access(state).active.view;
export const getActiveRepresentation = (state) =>
  access(state).active.representation;
export const getActiveSource = (state) => access(state).active.source;

export default {
  getActiveView,
  getActiveRepresentation,
  getActiveSource,
};
