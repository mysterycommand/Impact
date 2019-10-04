import SpriteSheet from './sprite-sheet';
import { system } from './impact';

export default class SpriteSheetAnimation {
  constructor(
    readonly sheet: SpriteSheet,
    readonly spf: number,
    readonly frames: number[],
    readonly stop = false,
  ) {}

  public draw(x: number, y: number) {
    if (
      x > system.width ||
      y > system.height ||
      x + this.sheet.width < 0 ||
      y + this.sheet.height < 0
    ) {
      return;
    }

    this.sheet.bitmap!.draw(
      0,
      0,
      this.sheet.width,
      this.sheet.height,
      x,
      y,
      this.sheet.width,
      this.sheet.height,
    );
  }
}
