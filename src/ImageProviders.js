const DEFAULT_IMAGE_PROVIDER = 'default';
const providers = {};
const listeners = {};

function setImageProvider(provider, key) {
  providers[key || DEFAULT_IMAGE_PROVIDER] = provider;
  const listenersToNotify = listeners[key || DEFAULT_IMAGE_PROVIDER] || [];
  listenersToNotify.forEach((listener) => {
    if (listener && !listener.called) {
      listener.callback(provider);
      listener.called = true;
    }
  });
}

function getImageProvider(key) {
  return providers[key || DEFAULT_IMAGE_PROVIDER];
}

function addListener(callback, key, called = false) {
  if (!listeners[key]) {
    listeners[key] = [];
  }
  const id = listeners[key].length;
  listeners[key].push({ called, callback });

  return id;
}

function onImageProvider(callback, key = DEFAULT_IMAGE_PROVIDER) {
  if (providers[key]) {
    callback(providers[key]);
    return addListener(callback, key, true);
  }

  return addListener(callback, key);
}

function unsubscribe(id, key = DEFAULT_IMAGE_PROVIDER) {
  listeners[key][id] = null;
}

function reset(key) {
  const listenersToReset = listeners[key || DEFAULT_IMAGE_PROVIDER] || [];
  listenersToReset.forEach((listener) => {
    listener.called = false;
  });
}

export default {
  setImageProvider,
  getImageProvider,
  onImageProvider,
  unsubscribe,
  reset,
};
