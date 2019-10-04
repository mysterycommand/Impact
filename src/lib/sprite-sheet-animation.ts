import SpriteSheet from './sprite-sheet';
import { system } from './impact';

export default class SpriteSheetAnimation {
  constructor(
    readonly spriteSheet: SpriteSheet,
    readonly spf: number,
    readonly frames: number[],
    readonly stop = false,
  ) {}

  public draw(x: number, y: number) {
    if (
      x > system.width ||
      y > system.height ||
      x + this.spriteSheet.width < 0 ||
      y + this.spriteSheet.height < 0
    ) {
      return;
    }

    this.spriteSheet.bitmap.draw(
      0,
      0,
      this.spriteSheet.width,
      this.spriteSheet.height,
      x,
      y,
      this.spriteSheet.width,
      this.spriteSheet.height,
    );
  }
}
