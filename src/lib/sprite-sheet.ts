import Bitmap from './bitmap';

export default class SpriteSheet {
  readonly bitmap = new Bitmap(this.path);

  constructor(readonly path: string, readonly width = 8, readonly height = 8) {}
}
