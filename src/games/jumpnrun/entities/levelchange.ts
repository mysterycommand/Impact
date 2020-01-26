import Entity from '../../../lib/entity';
// import { system } from '../../../lib/impact';
// import { LevelConfig } from '../../../types';

// import Trigger from './trigger';

export default class LevelChange extends Entity {
  public size = { x: 32, y: 32 };
  // public level?: LevelConfig;

  public update() {}

  public triggeredBy(/* entity: Entity, trigger: Trigger */) {
    // if (this.level) {
    //   system.game?.loadLevelDeferred(this.level);
    // }
  }
}
