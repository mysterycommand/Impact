import Entity, { Type, Collides, EntitySettings } from '../../../lib/entity';
import Timer from '../../../lib/timer';
import { system } from '../../../lib/impact';
// import { round } from '../../../lib/math';

interface Triggerable extends Entity {
  triggeredBy(other: Entity, trigger: Trigger): void;
}

function isTriggerable(entity: any): entity is Triggerable {
  return 'triggeredBy' in entity && typeof entity.triggeredBy === 'function';
}

export default class Trigger extends Entity {
  public type = Type.None;
  public checksAgainst = Type.Friend;
  public collides = Collides.Never;

  public targets: string[] = [];
  public wait = -1;
  public waitTimer = new Timer();
  public canFire = true;

  constructor(x: number, y: number, settings?: EntitySettings) {
    super(x, y, settings);
    Object.assign(this, settings);
  }

  public update() {}

  public draw() {
    super.draw();

    /**
     * DEBUG DRAW!
     */
    // system.context.strokeStyle = 'green';
    // system.context.lineWidth = 1.0;
    // system.context.strokeRect(
    //   (round(this.currPos.x) - (system.game?.screen.x || 0)) * system.scale -
    //     0.5,
    //   (round(this.currPos.y) - (system.game?.screen.y || 0)) * system.scale -
    //     0.5,
    //   this.size.x * system.scale,
    //   this.size.y * system.scale,
    // );
  }

  public check(other: Entity) {
    if (!(this.canFire && this.waitTimer.delta() >= 0)) {
      return;
    }

    const { game } = system;
    if (!game) {
      throw new Error('Tried to trigger without a game');
    }

    console.log(this.canFire, this.waitTimer.delta(), this.targets);
    this.targets.forEach(target => {
      const entity = game.getNamedEntity(target);
      console.log(entity.name, isTriggerable(entity));

      if (isTriggerable(entity)) {
        entity.triggeredBy(other, this);
      }
    });

    if (this.wait === -1) {
      this.canFire = false;
    } else {
      this.waitTimer.set(this.wait);
    }
  }
}
