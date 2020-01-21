import Entity, { Type, Collides } from '../../../lib/entity';
import SpriteSheet from '../../../lib/sprite-sheet';
import { system } from '../../../lib/impact';
import { TraceResult } from '../../../lib/maps/collision-map';

import blobPath from '../media/blob.png';
const blobResource = new SpriteSheet(blobPath, 64, 28);

export default class Glerp extends Entity {
  public size = { x: 40, y: 28 };
  public offset = { x: 24, y: 0 };

  public type = Type.Enemy;
  public checksAgainst = Type.Friend;
  public collides = Collides.Passive;

  public spriteSheet = blobResource;

  private speed = 36;
  private flip = false;

  constructor(x: number, y: number) {
    super(x, y);

    this.addAnim('crawl', 0.2, [0, 1]);
    this.addAnim('dead', 1, [2]);
  }

  public update() {
    const { game } = system;

    if (
      game?.collisionMap.getTile(
        this.currPos.x + (this.flip ? 4 : this.size.x - 4),
        this.currPos.y + this.size.y + 1,
      )
    ) {
      this.toggleFlip();
    }

    this.vel.x = this.speed * (this.flip ? -1 : 1);
    if (this.currAnim) {
      this.currAnim.flip.x = !this.flip;
    }

    super.update();
  }

  protected handleTrace(result: TraceResult) {
    super.handleTrace(result);

    if (result.collision.x) {
      this.toggleFlip();
    }
  }

  private toggleFlip() {
    this.flip = !this.flip;
    this.offset.x = this.flip ? 0 : 24;
  }
}
