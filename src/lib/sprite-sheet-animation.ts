import SpriteSheet from './sprite-sheet';
import { system } from './impact';

export default class SpriteSheetAnimation {
  constructor(readonly sheet: SpriteSheet) {}

  public draw(x: number, y: number) {
    if (
      x > system.width ||
      y > system.height ||
      x + this.sheet.width < 0 ||
      y + this.sheet.height < 0
    ) {
      return;
    }

    this.sheet.bitmap!.draw();
  }
}
