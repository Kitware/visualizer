import { createStore } from 'redux';

import actions from './actions';
import reducers from './reducers';
import selectors from './selectors';

export { actions, reducers, selectors };

export const store = createStore(reducers);

export function dispatch(action) {
  var currentAction = action;
  while (typeof currentAction === 'function') {
    currentAction = action(dispatch, store.getState);
  }
  return store.dispatch(currentAction);
}

export default store;
