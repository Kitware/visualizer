import Monologue from 'monologue.js';

const IMAGE_READY = 'local.image.ready';

export default class LocalRenderingImageProvider {
  fireImageReady(img) {
    this.emit(IMAGE_READY, { url: img });
  }

  onImageReady(callback) {
    return this.on(IMAGE_READY, callback);
  }

  /* eslint-disable class-methods-use-this */
  getLastImageReadyEvent() {
    return null;
  }
}

Monologue.mixInto(LocalRenderingImageProvider);
