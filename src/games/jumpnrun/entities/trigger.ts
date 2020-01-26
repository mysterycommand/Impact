import Entity from '../../../lib/entity';
import Timer from '../../../lib/timer';

export default class Trigger extends Entity {
  public size = { x: 32, y: 32 };

  private wait = -1;
  private waitTimer = new Timer();
  private canFire = true;

  constructor(x: number, y: number) {
    super(x, y);
  }

  public update() {}

  public check(other: Entity) {
    if (!(this.canFire && this.waitTimer.delta() >= 0)) {
      return;
    }

    // TODO: loop through targets?
    console.log('trigger');

    if (this.wait === -1) {
      this.canFire = false;
    } else {
      this.waitTimer.set(this.wait);
    }
  }
}
