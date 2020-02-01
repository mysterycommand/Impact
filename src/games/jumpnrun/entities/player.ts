import Entity, { EntitySettings } from '../../../lib/entity';
import { input } from '../../../lib/impact';
import SpriteSheet from '../../../lib/sprite-sheet';

import playerPath from '../media/player.png';

export default class Player extends Entity {
  public size = { x: 40, y: 88 };
  public offset = { x: 17, y: 10 };
  public friction = { x: 800, y: 0 };
  public maxVel = { x: 400, y: 800 };

  public spriteSheet = new SpriteSheet(playerPath, 75, 100);

  public health = 3;
  public maxHealth = 3;
  public coins = 0;

  private flip = false;
  private accelGround = 1_200;
  private accelAir = this.accelGround / 2;
  private velJump = 500;

  constructor(x: number, y: number, settings?: EntitySettings) {
    super(x, y, settings);

    this.addAnim('idle', 1, [15, 15, 15, 15, 15, 14]);
    this.addAnim('run', 0.07, [4, 5, 11, 0, 1, 2, 7, 8, 9, 3]);
    this.addAnim('jump', 1, [13]);
    this.addAnim('fall', 0.4, [13, 12], true);
    this.addAnim('pain', 0.3, [6], true);
  }

  public update() {
    // left & right
    const accel = this.isStanding ? this.accelGround : this.accelAir;

    if (input.state('left')) {
      this.acc.x = -accel;
      this.flip = true;
    } else if (input.state('right')) {
      this.acc.x = accel;
      this.flip = false;
    } else {
      this.acc.x = 0;
    }

    // jump
    if (this.isStanding && input.pressed('jump')) {
      this.vel.y = -this.velJump;
      // this.sfxJump.play();
    }

    // shoot
    if (input.pressed('shoot')) {
      // game.spawnEntity(
      //   Fireball,
      //   this.currPos.x,
      //   this.currPos.y + 40,
      //   this.flip,
      // );
    }

    // TODO: pain & death
    if (this.vel.y < 0) {
      this.currAnim = this.anims.jump;
    } else if (this.vel.y > 0) {
      if (this.currAnim !== this.anims.fall) {
        this.currAnim = this.anims.fall;
      }
    } else if ((this.vel.x += 0)) {
      this.currAnim = this.anims.run;
    } else {
      this.currAnim = this.anims.idle;
    }

    // flip
    this.currAnim.flip.x = this.flip;

    // move
    super.update();
  }

  public receiveCoins(coins: number) {
    this.coins += coins;
  }
}
