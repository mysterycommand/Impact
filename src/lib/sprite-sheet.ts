import Bitmap from './bitmap';
import { system } from './impact';

const { floor } = Math;

// TODO: there is no reason for this to be a class, interface + pojo, or roll it
// into the SpriteSheetAnimation class
export default class SpriteSheet {
  readonly bitmap = new Bitmap(this.path);

  constructor(readonly path: string, readonly width = 8, readonly height = 8) {}

  public draw(
    spriteIndex: number,
    targetX: number,
    targetY: number,
    flipX = false,
    flipY = false,
  ) {
    const { context, scale } = system;

    const w = floor(this.width * scale);
    const h = floor(this.height * scale);

    const scaleX = flipX ? -1 : 1;
    const scaleY = flipY ? -1 : 1;

    if (flipX || flipY) {
      context.save();
      context.scale(scaleX, scaleY);
    }

    this.bitmap.draw(
      (floor(spriteIndex * w) % this.bitmap.width) * scale,
      floor((spriteIndex * w) / this.bitmap.width) * h * scale,
      w,
      h,
      targetX * scaleX - (flipX ? w : 0),
      targetY * scaleY - (flipY ? h : 0),
      w,
      h,
    );

    if (flipX || flipY) {
      context.restore();
    }
  }
}
