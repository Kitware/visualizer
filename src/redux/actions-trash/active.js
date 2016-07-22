// --- Action types ---

export const ACTIVATE_OBJECT = 'ACTIVATE_OBJECT';

export const TYPE_SOURCE = 'source';
export const TYPE_REPRESENTATION = 'representation';
export const TYPE_VIEW = 'view';

// --- Pure actions ---

export function activate(id, name) {
  return { type: ACTIVATE_OBJECT, name, id };
}
