import Entity from '../../../lib/entity';
import { system } from '../../../lib/impact';

import config from '../levels/level-0';

export default class LevelChange extends Entity {
  public level = config;

  public update() {}

  public triggeredBy() {
    if (!(system.game && this.level)) {
      return;
    }

    system.game.levelToLoad = this.level;
  }
}
