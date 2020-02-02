import Entity, { EntitySettings, Type, Collides } from '../../../lib/entity';
import { input, system } from '../../../lib/impact';
import { min, max, floor, random } from '../../../lib/math';
import Sound from '../../../lib/sound';
import SpriteSheet from '../../../lib/sprite-sheet';

import config from '../levels/level-0';

import spriteSheetPath from '../media/player.png';
const spriteSheet = new SpriteSheet(spriteSheetPath, 75, 100);

import jumpSoundPath from '../media/sounds/player/Jump.mp3';
const jumpSound = new Sound(jumpSoundPath);

import hurtSound1Path from '../media/sounds/player/TakeDamage1.mp3';
const hurtSound1 = new Sound(hurtSound1Path);

import hurtSound2Path from '../media/sounds/player/TakeDamage2.mp3';
const hurtSound2 = new Sound(hurtSound2Path);

import hurtSound3Path from '../media/sounds/player/TakeDamage3.mp3';
const hurtSound3 = new Sound(hurtSound3Path);

export default class Player extends Entity {
  public type = Type.Friend;
  public checksAgainst = Type.None;
  public collides = Collides.Passive;

  public size = { x: 40, y: 88 };
  public offset = { x: 17, y: 10 };
  public friction = { x: 800, y: 0 };
  public maxVel = { x: 400, y: 800 };

  public spriteSheet = spriteSheet;
  public jumpSound = jumpSound;
  public hurtSounds = [hurtSound1, hurtSound2, hurtSound3];
  public get hurtSound() {
    return this.hurtSounds[floor(random() * this.hurtSounds.length)];
  }

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
      this.jumpSound.play();
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

    if (this.currAnim === this.anims.pain && this.currAnim.loopCount < 1) {
      if (this.health <= 0) {
        const fade = (1 / this.currAnim.spf) * system.tick;
        this.currAnim.alpha = min(max(0, this.currAnim.alpha - fade), 1);
      }
    } else if (this.health <= 0) {
      this.removeSelf();
    } else if (this.vel.y < 0) {
      this.currAnim = this.anims.jump;
    } else if (this.vel.y > 0) {
      if (this.currAnim !== this.anims.fall) {
        this.currAnim = this.anims.fall.rewind();
      }
    } else if ((this.vel.x += 0)) {
      this.currAnim = this.anims.run;
    } else {
      this.currAnim = this.anims.idle;
    }

    // flip
    if (this.currAnim) {
      this.currAnim.flip.x = this.flip;
    }

    // move
    super.update();
  }

  public receiveCoins(coins: number) {
    this.coins += coins;
  }

  public removeSelf() {
    super.removeSelf();

    if (!system.game) {
      return;
    }

    system.game.levelToLoad = config;
  }

  public receiveDamage(amount: number, other: Entity) {
    if (this.currAnim === this.anims.pain) {
      return;
    }

    this.health -= amount;
    this.currAnim = this.anims.pain.rewind();

    this.vel.x = other.currPos.x > this.currPos.x ? -400 : 400;
    this.vel.y = -300;

    this.hurtSound.play();
  }
}
