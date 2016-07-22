import * as Actions from '../actions/save';

const DATASET_MAPPING = {
  'AMR Dataset (Deprecated)': 'vtm',
  'Composite Dataset': 'vtm',
  'Hierarchical DataSet (Deprecated)': 'vtm',
  'Image (Uniform Rectilinear Grid) with blanking': 'vti',
  'Image (Uniform Rectilinear Grid)': 'vti',
  'Multi-block Dataset': 'vtm',
  'Multi-group Dataset': 'vtm',
  'Multi-piece Dataset': 'vtm',
  'Non-Overlapping AMR Dataset': 'vtm',
  'Overlapping AMR Dataset': 'vtm',
  'Point Set': 'vts',
  'Polygonal Mesh': 'vtp',
  'Rectilinear Grid': 'vtr',
  'Structured (Curvilinear) Grid': 'vts',
  'Structured Grid': 'vts',
  Table: 'csv',
  'Unstructured Grid': 'vtu',
};

export const initialState = {
  statuses: {
    screenshot: '',
    state: '',
    dataset: '',
  },
  paths: {
    screenshot: 'server-images/savedScreen.png',
    state: 'server-state/savedState.pvsm',
    dataset: 'server-data/savedDataset.vtk',
  },
};

export default function proxiesReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.UPDATE_SAVE_STATE: {
      const { status, mode } = action;
      const statuses = Object.assign({}, state.statuses, { [mode]: status });
      return Object.assign({}, state, { statuses });
    }

    case Actions.UPDATE_DATASET_FILENAME: {
      const xmlExt = DATASET_MAPPING[action.dataset] || 'vtk';
      const dataset = state.paths.dataset.replace(/\.[^\.]+$/, `.${xmlExt}`);
      const paths = Object.assign({}, state.paths, { dataset });
      return Object.assign({}, state, { paths });
    }

    case Actions.UPDATE_SAVE_PATH: {
      const paths = Object.assign({}, state.paths, { [action.mode]: action.path });
      return Object.assign({}, state, { paths });
    }

    default:
      return state;
  }
}
