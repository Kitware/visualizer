import { createStore } from 'redux';

import actions from './actions';
import reducers from './reducers';
import selectors from './selectors';

export { actions, reducers, selectors };

let activeStore = createStore(reducers);

export function dispatch(action) {
  let currentAction = action;
  while (typeof currentAction === 'function') {
    currentAction = action(dispatch, activeStore.getState);
  }
  return activeStore.dispatch(currentAction);
}

export function setVisualizerActiveStore(otherStore) {
  activeStore = otherStore;
}

export function getActiveStore() {
  return activeStore;
}
