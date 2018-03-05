import { createSelector } from 'reselect';
import access from './stateAccessor';
import {
  getActiveSourceId,
  getActiveRepresentation,
  getActiveRepresentationId,
} from './proxies';

// ----------------------------------------------------------------------------
// Pure state selection
// ----------------------------------------------------------------------------

export const getPiecewiseMap = (state) =>
  access(state).colors.piecewiseFunctions;
export const getGaussianMap = (state) =>
  access(state).colors.piecewiseGaussians;
export const getPresetsImages = (state) => access(state).colors.presetImages;
export const getScalarBarImages = (state) => access(state).colors.images;
export const getScalarBarRanges = (state) => access(state).colors.ranges;

// ----------------------------------------------------------------------------
// Composite selector
// ----------------------------------------------------------------------------

export const getColorByArray = createSelector(
  [getActiveRepresentation],
  (representation) =>
    representation && representation.colorBy.array
      ? representation.colorBy.array[1]
      : undefined
);

export const getPiecewisePoints = createSelector(
  [getColorByArray, getPiecewiseMap],
  (array, functions) => (array && functions ? functions[array] : undefined)
);

export const getScalarBarImage = createSelector(
  [getActiveRepresentationId, getScalarBarImages],
  (id, map) => map[id]
);

export const getScalarBarRange = createSelector(
  [getActiveSourceId, getScalarBarRanges],
  (id, map) => map[id]
);

export const getPiecewiseGaussians = createSelector(
  [getColorByArray, getGaussianMap],
  (array, functions) => (array && functions ? functions[array] : undefined)
);
