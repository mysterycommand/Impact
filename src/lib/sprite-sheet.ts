import Bitmap from './bitmap';

export default class SpriteSheet {
  readonly bitmap?: Bitmap;

  constructor(readonly path: string, readonly width = 8, readonly height = 8) {
    this.bitmap = new Bitmap(path);
  }
}
