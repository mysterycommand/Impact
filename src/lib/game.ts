import { system } from './impact';
import Entity from './entity';

import { LevelConfig } from '../types';

const { floor } = Math;

export default class Game {
  protected clearColor = '#000';

  protected screen = { x: 0, y: 0 };
  protected entities: Entity[] = [];
  protected namedEntites: { [name: string]: Entity } = {};
  protected cellSize = 64;

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

  public update() {
    this.updateEntities();
    this.checkEntities();
  }

  public draw() {
    system.clear(this.clearColor);
  }

  protected updateEntities() {
    this.entities
      .filter(({ isActive }) => isActive)
      .forEach(entity => {
        entity.update();
      });
  }

  protected checkEntities() {
    const { cellSize } = this;

    const table: { [col: number]: { [row: number]: Entity[] } } = {};
    this.entities
      .filter(({ isActive }) => isActive)
      .forEach(entity => {
        const { currPos, size } = entity;
        const checked: { [id: number]: boolean } = {};

        const xmin = floor(currPos.x / cellSize);
        const ymin = floor(currPos.y / cellSize);

        const xmax = floor((currPos.x + size.x) / cellSize) + 1;
        const ymax = floor((currPos.y + size.y) / cellSize) + 1;

        for (let col = xmin; col < xmax; ++col) {
          for (let row = ymin; row < ymax; ++row) {
            if (!table[col]) {
              table[col] = {
                [row]: [entity],
              };
              continue;
            }

            if (!table[col][row]) {
              table[col][row] = [entity];
              continue;
            }

            const cell = table[col][row];
            cell.forEach(e => {
              if (!checked[e.id]) {
                checked[e.id] = true;
              }
            });
            cell.push(entity);
          }
        }
      });
  }
}
