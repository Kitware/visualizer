import network from '../../network';
import * as netActions from './network';

// --- Action types ---

export const DIRECTORY_STORE = 'DIRECTORY_STORE';
export const RESET_DIRECTORY_STORE = 'RESET_DIRECTORY_STORE';
export const ACTIVE_DIRECTORY = 'ACTIVE_DIRECTORY';

// --- Pure actions ---

export function storeDirectoryListing(path, listing) {
  return { type: DIRECTORY_STORE, path, listing };
}

export function clearCache() {
  return { type: RESET_DIRECTORY_STORE };
}

export function storeActiveDirectory(activePath) {
  return { type: ACTIVE_DIRECTORY, activePath };
}

// --- Async actions ---

export function fetchServerDirectory(pathToList) {
  return dispatch => {
    const netRequest = netActions.createRequest('Fetch server directory listing');
    network.getClient()
      .FileListing
      .listServerDirectory(pathToList)
      .then(
        listing => {
          dispatch(netActions.success(netRequest.id, listing));
          const { dirs, files, groups, path, label } = listing;
          const fileLabels = files.map(i => i.label);
          dispatch(storeDirectoryListing(pathToList, { dirs, files: fileLabels, groups, path, label }));
        },
        err => {
          dispatch(netActions.error(netRequest.id, err));
        });

    return netRequest;
  };
}
