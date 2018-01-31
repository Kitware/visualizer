import network from '../../network';
import * as netActions from './network';

const externalActions = {
  network: netActions,
};

// --- Action types -----------------------------------------------------------

const DIRECTORY_STORE = 'DIRECTORY_STORE';
const RESET_DIRECTORY_STORE = 'RESET_DIRECTORY_STORE';
const ACTIVE_DIRECTORY = 'ACTIVE_DIRECTORY';

// --- Reducer ----------------------------------------------------------------

export const initialState = {
  listings: {},
  activePath: '.',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DIRECTORY_STORE: {
      const { path, listing } = action;
      const listings = Object.assign({}, state.listings, { [path]: listing });
      return Object.assign({}, state, { listings });
    }

    case RESET_DIRECTORY_STORE: {
      return {};
    }

    case ACTIVE_DIRECTORY: {
      const { activePath } = action;
      return Object.assign({}, state, { activePath });
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
  return (dispatch) => {
    const netRequest = externalActions.network.createRequest(
      'Fetch server directory listing'
    );
    network
      .getClient()
      .FileListing.listServerDirectory(pathToList)
      .then(
        (listing) => {
          dispatch(externalActions.network.success(netRequest.id, listing));
          const { dirs, files, groups, path, label } = listing;
          const fileLabels = files.map((i) => i.label);
          dispatch(
            storeDirectoryListing(pathToList, {
              dirs,
              files: fileLabels,
              groups,
              path,
              label,
            })
          );
        },
        (err) => {
          dispatch(externalActions.network.error(netRequest.id, err));
        }
      );

    return netRequest;
  };
}
