import Bitmap from './bitmap';

export default class SpriteSheet {
  readonly bitmap?: Bitmap;

  constructor(
    readonly path: string,
    readonly spriteWidth = 8,
    readonly spriteHeight = 8,
  ) {
    this.bitmap = new Bitmap(path);
  }
}
