import { system } from './impact';
import Entity from './entity';

import { LevelConfig } from '../types';

export default class Game {
  protected clearColor = '#000';

  protected screen = { x: 0, y: 0 };
  protected entities: Entity[] = [];
  protected namedEntites: { [name: string]: Entity } = {};

  protected loadLevel({ entities, layers }: LevelConfig) {
    this.screen = { x: 0, y: 0 };
    this.entities = [];
    this.namedEntites = {};

    entities.forEach(({ EntityClass, x, y }) => {
      this.spawnEntity(EntityClass, x, y);
    });
    this.sortEntities();

    // do map stuff here

    this.entities.forEach(entity => {
      entity.ready();
    });
  }

  protected spawnEntity(EntityClass: typeof Entity, x: number, y: number) {
    const entity = new EntityClass(x, y);

    this.entities.push(entity);
    if (entity.name) {
      this.namedEntites[entity.name] = entity;
    }

    return entity;
  }

  protected sortEntities() {
    this.entities.sort((a, b) => a.zIndex - b.zIndex);
  }

  public run() {
    this.update();
    this.draw();
  }

  public update() {}

  public draw() {
    system.clear(this.clearColor);
  }
}
