// --- Action types -----------------------------------------------------------

const UPDATE_VISIBLE_PANEL = 'UPDATE_VISIBLE_PANEL';
const UPDATE_COLLAPSABLE_STATE = 'UPDATE_COLLAPSABLE_STATE';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  visiblePanel: 0,         // PipelineBrowser
  collapsableState: {
    // Collapsable Widgets in SavePanel
    localScreenShot: true, // opened
    screenshot: false,     // closed
    dataset: false,        // closed
    state: false,          // closed

    // Sections of property list in PipelineBrowser
    Source: false,         // Open
    Representation: true,  // Closed
    View: true,            // Closed
    RenderViewSettingsCollapsed: false, // Open
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_VISIBLE_PANEL: {
      const visiblePanel = action.index;
      return Object.assign({}, state, { visiblePanel });
    }

    case UPDATE_COLLAPSABLE_STATE: {
      const collapsableState = Object.assign({}, state.collapsableState, { [action.name]: action.open });
      return Object.assign({}, state, { collapsableState });
    }

    case 'RESET_VISUALIZER_STATE': {
      return initialState;
    }

    default:
      return state;
  }
}

// --- Action Creators --------------------------------------------------------

// --- Pure actions ---

export function updateVisiblePanel(index) {
  return { type: UPDATE_VISIBLE_PANEL, index };
}

export function updateCollapsableState(name, open) {
  return { type: UPDATE_COLLAPSABLE_STATE, name, open };
}
