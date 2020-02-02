import Entity, { Type } from '../../../lib/entity';
import Sound from '../../../lib/sound';
import SpriteSheet from '../../../lib/sprite-sheet';

import coinPath from '../media/coin.png';
const spriteSheet = new SpriteSheet(coinPath, 36, 36);

import heal1Path from '../media/sounds/player/Heal1.mp3';
import heal2Path from '../media/sounds/player/Heal2.mp3';
import heal3Path from '../media/sounds/player/Heal3.mp3';
import heal4Path from '../media/sounds/player/Heal4.mp3';

const heal1Sound = new Sound(heal1Path);
const heal2Sound = new Sound(heal2Path);
const heal3Sound = new Sound(heal3Path);
const heal4Sound = new Sound(heal4Path);

import Player from './player';
import { random, floor } from '../../../lib/math';

export default class Coin extends Entity {
  public size = { x: 36, y: 36 };
  public spriteSheet = spriteSheet;

  public checksAgainst = Type.Friend;

  private healSounds = [heal1Sound, heal2Sound, heal3Sound, heal4Sound];
  private get healSound() {
    return this.healSounds[floor(random() * this.healSounds.length)];
  }

  constructor(x: number, y: number) {
    super(x, y);
    this.addAnim('idle', 0.1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]);
  }

  public update() {
    this.currAnim?.update();
  }

  public check(other: Entity) {
    if (other instanceof Player) {
      other.receiveCoins(1);
      this.healSound.play();
      this.removeSelf();
    }
  }
}
