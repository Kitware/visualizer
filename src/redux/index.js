import actions from './actions';
import reducers from './reducers';
import selectors from './selectors';
import { createStore } from 'redux';

const store = createStore(reducers);

function dispatch(action) {
  var currentAction = action;
  while (typeof currentAction === 'function') {
    currentAction = action(dispatch, store.getState);
  }
  return store.dispatch(currentAction);
}

let rootStateAccessor = state => state;
const getRootState = (state) => rootStateAccessor(state);

export function updateVisualizerRootState(fn) {
  rootStateAccessor = fn;
}

export default store;

export {
  actions,
  dispatch,
  selectors,
  store,
  getRootState,
};
