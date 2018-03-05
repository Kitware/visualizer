import network from '../../network';
import * as netActions from './network';

// --- Action types -----------------------------------------------------------

const UPDATE_SAVE_STATE = 'UPDATE_SAVE_STATE';
const UPDATE_DATASET_FILENAME = 'UPDATE_DATASET_FILENAME';
const UPDATE_SAVE_PATH = 'UPDATE_SAVE_PATH';

// --- Reducer ----------------------------------------------------------------

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
    case UPDATE_SAVE_STATE: {
      const { status, mode } = action;
      const statuses = Object.assign({}, state.statuses, { [mode]: status });
      return Object.assign({}, state, { statuses });
    }

    case UPDATE_DATASET_FILENAME: {
      const xmlExt = DATASET_MAPPING[action.dataset] || 'vtk';
      const dataset = state.paths.dataset.replace(/\.[^.]+$/, `.${xmlExt}`);
      const paths = Object.assign({}, state.paths, { dataset });
      return Object.assign({}, state, { paths });
    }

    case UPDATE_SAVE_PATH: {
      const paths = Object.assign({}, state.paths, {
        [action.mode]: action.path,
      });
      return Object.assign({}, state, { paths });
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

export function updateSaveStatus(mode, status) {
  return { type: UPDATE_SAVE_STATE, mode, status };
}

export function updateDatasetFilename(dataset) {
  return { type: UPDATE_DATASET_FILENAME, dataset };
}

export function updateSavePath(mode, path) {
  return { type: UPDATE_SAVE_PATH, mode, path };
}

// --- Async actions ---

export function saveData(type, path, options = {}) {
  return (dispatch) => {
    const netRequest = netActions.createRequest('Save data');
    dispatch(updateSaveStatus(type, 'pending'));
    network
      .getClient()
      .SaveData.saveData(path, options)
      .then(
        (pipeline) => {
          dispatch(netActions.success(netRequest.id, pipeline));
          dispatch(updateSaveStatus(type, 'success'));
        },
        (err) => {
          dispatch(netActions.error(netRequest.id, err));
          dispatch(updateSaveStatus(type, 'error'));
        }
      );
    return netRequest;
  };
}
