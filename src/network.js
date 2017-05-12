import { createClient } from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';
import SmartConnect from 'paraviewweb/src/IO/WebSocket/SmartConnect';

var connection = null,
  client = null,
  smartConnect = null,
  readyCallback = null;

const customProtocols = {
  // Time(session) {
  //     return {
  //         setTimeIndex: (idx) => {
  //             return session.call('visualizer.time.index.set', [ idx ]);
  //         },
  //         getTimeIndex: () => {
  //             return session.call('visualizer.time.index.get', []);
  //         },
  //     };
  // },
};

function start(conn) {
  connection = conn;
  client = createClient(conn, [
    'ColorManager',
    'FileListing',
    'MouseHandler',
    'SaveData',
    'ProxyManager',
    'TimeHandler',
    'ViewPort',
    'VtkGeometryDelivery',
  ], customProtocols);

  if (readyCallback) {
    readyCallback();
  }
}

function exit(timeout = 60) {
  if (connection) {
    connection.destroy(timeout);
    connection = null;
  }
}

function connect(config = {}) {
  smartConnect = new SmartConnect(config);
  smartConnect.onConnectionReady(start);
  smartConnect.connect();
}

function getClient() {
  return client;
}

function getConnection() {
  return connection;
}

function onReady(callback) {
  if (client && client.session.isOpen) {
    callback();
  } else {
    readyCallback = callback;
  }
}

export default {
  exit,
  connect,
  getClient,
  getConnection,
  onReady,
};
