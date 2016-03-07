import ParaViewWebClient from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';
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
  client = ParaViewWebClient.createClient(conn, [
    'ColorManager',
    'FileListing',
    'MouseHandler',
    'SaveData',
    'ProxyManager',
    'TimeHandler',
    'ViewPort',
  ], customProtocols);

  if (readyCallback) {
    readyCallback();
  }
}

export function connect(config = {}) {
  smartConnect = new SmartConnect(config);
  smartConnect.onConnectionReady(start);
  smartConnect.connect();
}

export function getClient() {
  return client;
}

export function getConnection() {
  return connection;
}

export function onReady(callback) {
  if (client) {
    callback();
  } else {
    readyCallback = callback;
  }
}
