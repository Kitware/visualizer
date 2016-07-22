// --- Global variables ---

let uniqueRequestId = 1;

// --- Action types ---

export const NETWORK_REQUEST = 'NETWORK_REQUEST';
export const NETWORK_SUCCESS = 'NETWORK_SUCCESS';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const FREE_NETWORK_REQUESTS = 'FREE_NETWORK_REQUESTS';

function now() {
  return + new Date();
}

// --- Pure actions ---

export function createRequest(message = 'no description') {
  const id = `${uniqueRequestId++}`;
  return { type: NETWORK_REQUEST, id, message, start: now() };
}

export function success(id, data = {}) {
  return { type: NETWORK_SUCCESS, id, data, end: now() };
}

export function error(id, data = {}) {
  return { type: NETWORK_ERROR, id, data, end: now() };
}

export function freeNetworkRequests(size = 10) {
  return { type: FREE_NETWORK_REQUESTS, size };
}
