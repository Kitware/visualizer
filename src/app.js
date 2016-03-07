import * as network from './network';
import MainView from './MainView';
import ProxyManager from './ProxyManager';
import React from 'react';
import ReactDOM from 'react-dom';

require('normalize.css');

function start() {
  const container = document.querySelector('.content');
  const client = network.getClient();
  const proxyManager = new ProxyManager(client);

  ReactDOM.unmountComponentAtNode(container);
  return ReactDOM.render(React.createElement(MainView, { proxyManager }), container);
}

export function connect(config = {}) {
  network.onReady(start);
  network.connect(config);
}
