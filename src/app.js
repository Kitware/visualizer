import 'normalize.css';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

import network from './network';
import setup from './setup';
import MainView from './MainView';
import { getActiveStore } from './redux';

function start() {
  setImmediate(() => {
    setup(network.getClient().session);
  });

  // Mount UI
  const container = document.querySelector('.content');
  ReactDOM.unmountComponentAtNode(container);
  ReactDOM.render(
    <Provider store={getActiveStore()}>
      <MainView />
    </Provider>,
    container
  );
}

export function connect(config = {}) {
  network.onReady(start);
  network.connect(config);
}

export function connectWithArgsAsConfig(baseConfig = {}) {
  const userParams = vtkURLExtract.extractURLParameters();
  const config = Object.assign({}, baseConfig, userParams);
  connect(config);
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
