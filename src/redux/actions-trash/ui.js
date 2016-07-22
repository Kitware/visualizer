// --- Action types ---

export const UPDATE_VISIBLE_PANEL = 'UPDATE_VISIBLE_PANEL';
export const UPDATE_COLLAPSABLE_STATE = 'UPDATE_COLLAPSABLE_STATE';

// --- Pure actions ---

export function updateVisiblePanel(index) {
  return { type: UPDATE_VISIBLE_PANEL, index };
}

export function updateCollapsableState(name, open) {
  return { type: UPDATE_COLLAPSABLE_STATE, name, open };
}
