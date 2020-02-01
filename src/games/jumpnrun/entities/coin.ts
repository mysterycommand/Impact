import Entity from '../../../lib/entity';
import Sound from '../../../lib/sound';
import SpriteSheet from '../../../lib/sprite-sheet';

import coinPath from '../media/coin.png';
const spriteSheet = new SpriteSheet(coinPath, 36, 36);

import collectPath from '../media/sounds/coin.mp3';
const collectSound = new Sound(collectPath);

import Player from './player';

export default class Coin extends Entity {
  public size = { x: 36, y: 36 };
  public spriteSheet = spriteSheet;

  private collectSound = collectSound;

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
      this.collectSound.play();
      this.kill();
    }
  }
}
