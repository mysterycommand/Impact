import { system } from './impact';

import SpriteSheet from './sprite-sheet';
import Timer from './timer';

const { floor } = Math;

export default class SpriteSheetAnimation {
  public flip = { x: false, y: false };
  // private pivot = {
  //   x: this.spriteSheet.width / 2,
  //   y: this.spriteSheet.height / 2,
  // };

  private timer = new Timer();

  private frame = 0;
  private sprite = this.frames[this.frame];
  private loopCount = 0;

  public alpha = 1;
  public angle = 0;

  constructor(
    readonly spriteSheet: SpriteSheet,
    readonly spf: number, // seconds per frame
    readonly frames: number[],
    readonly stop = false,
  ) {}

  public update() {
    const frameTotal = floor(this.timer.delta() / this.spf);
    this.loopCount = floor(frameTotal / this.frames.length);

    if (this.stop && this.loopCount > 0) {
      this.frame = this.frames.length - 1;
    } else {
      this.frame = frameTotal % this.frames.length;
    }

    this.sprite = this.frames[this.frame];
  }

  public draw(x: number, y: number) {
    if (
      x > system.width ||
      y > system.height ||
      x + this.spriteSheet.width < 0 ||
      y + this.spriteSheet.height < 0
    ) {
      return;
    }

    const { context } = system;

    if (this.alpha !== 1) {
      context.globalAlpha = this.alpha;
    }

    if (this.angle === 0) {
      this.spriteSheet.draw(this.sprite, x, y, this.flip.x, this.flip.y);
    } else {
      // TODO: implement rotation!
    }

    if (this.alpha !== 1) {
      context.globalAlpha = 1;
    }
  }
}
