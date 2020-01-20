import Bitmap from './bitmap';
import { system } from './impact';

const { floor } = Math;

// TODO: there is no reason for this to be a class, interface + pojo, or roll it
// into the SpriteSheetAnimation class
export default class SpriteSheet {
  readonly bitmap = new Bitmap(this.path);

  constructor(readonly path: string, readonly width = 8, readonly height = 8) {}

  public draw(spriteIndex: number, targetX: number, targetY: number) {
    const { scale } = system;

    const w = floor(this.width * scale);
    const h = floor(this.height * scale);

    this.bitmap.draw(
      (floor(spriteIndex * w) % this.bitmap.width) * scale,
      floor((spriteIndex * w) / this.bitmap.width) * h * scale,
      w,
      h,
      targetX,
      targetY,
      w,
      h,
    );
  }
}
