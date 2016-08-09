/* global document window */

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import network from './network';
import MainView from './MainView';

import { store, dispatch, actions } from './redux';
import behaviorOnChange from './behavior';

require('normalize.css');

function start() {
  setImmediate(() => {
    // Keep track of any server notification
    network.getClient().session.subscribe('pv.time.change', (args) => {
      const index = args[0].timeStep;
      setImmediate(() => {
        dispatch(actions.time.storeTime(index));
        const state = store.getState();
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
    store.subscribe(() => {
      const state = store.getState();
      behaviorOnChange(state, dispatch);
    });
  });

  // Mount UI
  const container = document.querySelector('.content');
  ReactDOM.unmountComponentAtNode(container);
  ReactDOM.render(<Provider store={store}><MainView /></Provider>, container);
}

export function connect(config = {}) {
  network.onReady(start);
  network.connect(config);
}

export function autoStopServer(timeout = 60) {
  function exitOnClose() {
    network.exit(timeout);
  }
  window.addEventListener('unload', exitOnClose);
  window.addEventListener('beforeunload', exitOnClose);
}

export function exit(timeout = 60) {
  network.exit(timeout);
}
