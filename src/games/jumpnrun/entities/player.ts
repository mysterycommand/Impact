import Entity from '../../../lib/entity';
import SpriteSheet from '../../../lib/sprite-sheet';

import playerPath from '../media/player.png';
const playerResource = new SpriteSheet(playerPath, 75, 100);

export default class Player extends Entity {
  public size = { x: 40, y: 88 };
  public offset = { x: 17, y: 10 };
  public friction = { x: 800, y: 0 };
  public maxVel = { x: 400, y: 800 };

  private flip = false;

  public spriteSheet = playerResource;

  constructor(x: number, y: number) {
    super(x, y);

    this.addAnim('idle', 1, [15, 15, 15, 15, 15, 14]);
    this.addAnim('run', 0.07, [4, 5, 11, 0, 1, 2, 7, 8, 9, 3]);
    this.addAnim('jump', 1, [13]);
    this.addAnim('fall', 0.4, [13, 12], true);
    this.addAnim('pain', 0.3, [6], true);

    console.log(this);
  }

  public update() {
    // TODO: handle user input

    // TODO: handle animation/state stuff
    this.currAnim = this.anims.idle;

    this.currAnim.flip.x = this.flip;

    super.update();
  }
}
