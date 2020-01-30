import Entity from '../../../lib/entity';
import Timer from '../../../lib/timer';
import { system } from '../../../lib/impact';

interface Triggerable extends Entity {
  triggeredBy(other: Entity, trigger: Trigger): void;
}

function isTriggerable(entity: any): entity is Triggerable {
  return 'triggeredBy' in entity && typeof entity.triggeredBy === 'function';
}

type TriggerSettings = {
  size: { x: number; y: number };
  targets: string[];
  wait: number;
};

export default class Trigger extends Entity {
  public size = { x: 32, y: 32 };
  public targets: string[] = [];

  private wait = -1;
  private waitTimer = new Timer();
  private canFire = true;

  constructor(x: number, y: number, { size, targets, wait }: TriggerSettings) {
    super(x, y);

    this.size.x = size.x;
    this.size.y = size.y;
    this.targets = targets;
    this.wait = wait;
  }

  public update() {}

  public check(other: Entity) {
    if (!(this.canFire && this.waitTimer.delta() >= 0)) {
      return;
    }

    const { game } = system;
    if (!game) {
      throw new Error('Tried to trigger without a game');
    }

    this.targets.forEach(target => {
      const entity = game.getNamedEntity(target);

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
