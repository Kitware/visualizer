import * as Actions from '../actions/ui';

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

export default function timeReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.UPDATE_VISIBLE_PANEL: {
      const visiblePanel = action.index;
      return Object.assign({}, state, { visiblePanel });
    }

    case Actions.UPDATE_COLLAPSABLE_STATE: {
      const collapsableState = Object.assign({}, state.collapsableState, { [action.name]: action.open });
      return Object.assign({}, state, { collapsableState });
    }

    default:
      return state;
  }
}
