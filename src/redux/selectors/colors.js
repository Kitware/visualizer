import { createSelector } from 'reselect';
import { getActiveSourceId, getActiveRepresentation, getActiveRepresentationId } from './proxies';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPiecewiseMap = state => state.colors.piecewiseFunctions;
export const getPresetsImages = state => state.colors.presetImages;
export const getScalarBarImages = state => state.colors.images;
export const getScalarBarRanges = state => state.colors.ranges;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getColorByArray = createSelector(
  [getActiveRepresentation],
  (representation) => (representation ? representation.colorBy.array[1] : undefined)
);

export const getPiecewisePoints = createSelector(
  [getColorByArray, getPiecewiseMap],
  (array, functions) => ((array && functions) ? functions[array] : undefined)
);

export const getScalarBarImage = createSelector(
  [getActiveRepresentationId, getScalarBarImages],
  (id, map) => map[id]
);

export const getScalarBarRange = createSelector(
  [getActiveSourceId, getScalarBarRanges],
  (id, map) => map[id]
);
