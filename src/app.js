import 'normalize.css';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import ProgressLoaderWidget from 'paraviewweb/src/React/Widgets/ProgressLoaderWidget';

import network from './network';
import setup from './setup';
import MainView from './MainView';

import { getActiveStore, dispatch, actions } from './redux';

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

function loading(message = 'Loading ParaView...') {
  // Mount UI
  const container = document.querySelector('.content');
  ReactDOM.unmountComponentAtNode(container);
  ReactDOM.render(<ProgressLoaderWidget message={message} />, container);
}

export function connect(config = {}) {
  loading();
  network.onReady(start);
  network.onError(loading);
  network.onClose(() => loading('Server disconnected'));
  network.connect(config);

  // Configure renderer to local if asked for
  if (config.renderer) {
    dispatch(actions.view.setRemoteRendering(config.renderer === 'remote'));
  }
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
