import Bitmap from './bitmap';

// TODO: there is no reason for this to be a class, interface + pojo, or roll it
// into the SpriteSheetAnimation class
export default class SpriteSheet {
  readonly bitmap = new Bitmap(this.path);

  constructor(readonly path: string, readonly width = 8, readonly height = 8) {}
}
