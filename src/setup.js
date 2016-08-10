import { getActiveStore, dispatch, actions } from './redux';
import behaviorOnChange from './behavior';
import stateAccessor from './redux/selectors/stateAccessor';

export default function setup(session) {
  // Keep track of any server notification
  session.subscribe('pv.time.change', (args) => {
    const index = args[0].timeStep;
    setImmediate(() => {
      dispatch(actions.time.storeTime(index));
      const state = stateAccessor(getActiveStore().getState());
      if (state.active.source && state.active.source !== '0') {
        // Update proxy data for info tab...
        // FIXME implement a lighter implementation on the server side...
        dispatch(actions.proxies.fetchProxy(state.active.source));
      }
    });
  });

  // Fetch data
  dispatch(actions.proxies.fetchPipeline());
  dispatch(actions.proxies.fetchAvailableProxies());
  dispatch(actions.proxies.fetchSettingProxy());
  dispatch(actions.time.fetchTime());
  dispatch(actions.files.fetchServerDirectory('.'));

  // Fetch heavy data after full initialization
  setTimeout(() => {
    dispatch(actions.colors.fetchColorMapImages());
  }, 2000);


  // Attach default behavior
  getActiveStore().subscribe(() => {
    const state = stateAccessor(getActiveStore().getState());
    behaviorOnChange(state, dispatch);
  });
}
