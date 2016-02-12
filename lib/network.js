import vtkWebClientFactory from 'tonic-io/lib/VtkWeb/client/pvw/ClientFactory';
import VtkWebSmartConnect  from 'tonic-io/lib/VtkWeb/SmartConnect';

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
    client = vtkWebClientFactory(conn, [
        'FileListing',
        'MouseHandler',
        'ProxyManager',
        'TimeHandler',
        'ViewPort',
    ], customProtocols);

    if(readyCallback) {
        readyCallback();
    }
}

export function connect(config={}) {
    smartConnect = new VtkWebSmartConnect(config);
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
    if(client) {
        callback();
    } else {
        readyCallback = callback;
    }
}


// ''
