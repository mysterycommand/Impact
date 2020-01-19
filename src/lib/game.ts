import { LevelConfig } from '../types';

import Entity, { checkPair } from './entity';
import { system } from './impact';
import CollisionMap from './maps/collision-map';
import SceneryMap from './maps/scenery-map';
import Bitmap from './bitmap';

const { floor } = Math;

export default class Game {
  protected clearColor = '#000';

  protected screen = { x: 0, y: 0 };
  protected entities: Entity[] = [];
  protected namedEntites: { [name: string]: Entity } = {};
  protected cellSize = 64;

  protected backgroundMaps: SceneryMap[] = [];
  protected collisionMap: CollisionMap = CollisionMap.none;

  protected loadLevel({ entities, layers }: LevelConfig) {
    this.screen = { x: 0, y: 0 };
    this.entities = [];
    this.namedEntites = {};

    entities.forEach(({ EntityClass, x, y }) => {
      this.spawnEntity(EntityClass, x, y);
    });
    this.sortEntities();

    const cm = layers.find(({ name }) => name === 'collision');
    if (cm !== undefined) {
      const { data, tileSize } = cm;
      this.collisionMap = new CollisionMap(data, tileSize);
    }

    this.backgroundMaps = layers
      .filter(({ name }) => name !== 'collision')
      .map(({ data, tileSize, tileSetName, name, repeat }) => {
        const backgroundMap = new SceneryMap(
          data,
          tileSize,
          new Bitmap(tileSetName),
        );

        backgroundMap.name = name;
        backgroundMap.shouldRepeat = repeat;

        return backgroundMap;
      });

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
    // TODO: load new level

    this.updateEntities();
    this.checkEntities();

    // TODO: remove killed entities
    // TODO: re-sort entities
    // TODO: update background animations
  }

  public draw() {
    system.clear(this.clearColor);

    // TODO: figure out what `game._rscreen` is and why it exists

    // TODO: draw background maps
    this.drawEntities();
    // TODO: draw foreground maps
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
            cell.forEach(other => {
              if (!checked[other.id] && entity.isTouching(other)) {
                checked[other.id] = true;
                checkPair(entity, other);
              }
            });
            cell.push(entity);
          }
        }
      });
  }

  protected drawEntities() {
    this.entities.forEach(entity => {
      if (!entity.isActive) {
        throw new Error(
          `Trying to draw inactive entity: ${entity.id} - ${entity.toString()}`,
        );
      }

      entity.draw();
    });
  }
}
