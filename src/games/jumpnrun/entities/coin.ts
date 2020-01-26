import Entity from '../../../lib/entity';
import SpriteSheet from '../../../lib/sprite-sheet';

import coinPath from '../media/coin.png';

import Player from './player';

export default class Coin extends Entity {
  public size = { x: 36, y: 36 };
  public spriteSheet = new SpriteSheet(coinPath, 36, 36);

  constructor(x: number, y: number) {
    super(x, y);
    this.addAnim('idle', 0.1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]);
  }

  public update() {
    this.currAnim?.update();
  }

  public check(other: Entity) {
    if (other instanceof Player) {
      // other.giveCoins(1);
      // this.sfxCollect.play();
      // this.kill();
    }
  }
}
