import Entity from '../../../lib/entity';
import { system } from '../../../lib/impact';
import { TraceResult } from '../../../lib/maps/collision-map';
import SpriteSheet from '../../../lib/sprite-sheet';

import fireballPath from '../media/fireball.png';

export default class Fireball extends Entity {
  public size = { x: 36, y: 36 };
  public offset = { x: 6, y: 6 };
  public maxVel = { x: 800, y: 400 };

  public bounciness = 0.8;

  public spriteSheet = new SpriteSheet(fireballPath, 36, 36);

  private bounceCount = 0;

  constructor(x: number, y: number, { flip }: { flip: boolean }) {
    super(x, y);

    this.vel.x = flip ? -this.maxVel.x : this.maxVel.x;
    this.vel.y = 200;

    this.addAnim('idle', 1, [0]);
    // this.sfxSpawn.play();
  }

  public update() {
    super.update();

    if (this.currAnim) {
      this.currAnim.angle += system.tick * 10;
    }
  }

  public handleTrace(result: TraceResult) {
    super.handleTrace(result);

    const {
      collision: { x, y, slope },
    } = result;
    if (x || y || slope !== false) {
      this.bounceCount++;

      if (this.bounceCount > 3) {
        // this.kill();
      }
    }
  }

  public check(/* other: Entity */) {
    // other.receiveDamage(1, this);
    // this.kill();
  }
}

// EntityPool.enableFor(Fireball);
