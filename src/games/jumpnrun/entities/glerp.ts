import Entity, { Type, Collides } from '../../../lib/entity';
import SpriteSheet from '../../../lib/sprite-sheet';

import blobPath from '../media/blob.png';
const blobResource = new SpriteSheet(blobPath, 64, 28);

export default class Glerp extends Entity {
  public size = { x: 40, y: 28 };
  public offset = { x: 24, y: 0 };

  public type = Type.Enemy;
  public checksAgainst = Type.Friend;
  public collides = Collides.Passive;

  public spriteSheet = blobResource;

  constructor(x: number, y: number) {
    super(x, y);

    this.addAnim('crawl', 0.2, [0, 1]);
    this.addAnim('dead', 1, [2]);
  }

  update() {
    super.update();
  }
}
