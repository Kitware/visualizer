const DEFAULT_IMAGE_PROVIDER = 'default';
const providers = {};
const listeners = {};

function setImageProvider(provider, key) {
  providers[key || DEFAULT_IMAGE_PROVIDER] = provider;
  const listenersToNotify = listeners[key || DEFAULT_IMAGE_PROVIDER] || [];
  listenersToNotify.forEach((cb) => {
    if (cb) {
      cb(provider);
    }
  });
  delete listeners[key || DEFAULT_IMAGE_PROVIDER];
}

function getImageProvider(key) {
  return providers[key || DEFAULT_IMAGE_PROVIDER];
}

function onImageProvider(callback, key = DEFAULT_IMAGE_PROVIDER) {
  if (providers[key]) {
    callback(providers[key]);
    return -1;
  }

  if (!listeners[key]) {
    listeners[key] = [];
  }
  const id = listeners[key].length;
  listeners[key].push(callback);

  return id;
}

function unsubscribe(id, key = DEFAULT_IMAGE_PROVIDER) {
  listeners[key][id] = null;
}

export default {
  setImageProvider,
  getImageProvider,
  onImageProvider,
  unsubscribe,
};
