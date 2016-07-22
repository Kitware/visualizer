import network from '../../network';
import * as netActions from './network';

// --- Action types ---

export const UPDATE_SAVE_STATE = 'UPDATE_SAVE_STATE';
export const UPDATE_DATASET_FILENAME = 'UPDATE_DATASET_FILENAME';
export const UPDATE_SAVE_PATH = 'UPDATE_SAVE_PATH';

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
  return dispatch => {
    const netRequest = netActions.createRequest('Save data');
    dispatch(updateSaveStatus(type, 'pending'));
    network.getClient().SaveData.saveData(path, options)
      .then(
        pipeline => {
          dispatch(netActions.success(netRequest.id, pipeline));
          dispatch(updateSaveStatus(type, 'success'));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
          dispatch(updateSaveStatus(type, 'error'));
        });
    return netRequest;
  };
}
