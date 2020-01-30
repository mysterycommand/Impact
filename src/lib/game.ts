import { LevelConfig } from '../types';

import Entity, { checkPair } from './entity';
import { system } from './impact';
import CollisionMap from './maps/collision-map';
import SceneryMap from './maps/scenery-map';
import SpriteSheet from './sprite-sheet';

const { floor } = Math;

export default class Game {
  public readonly gravity: number = 0;

  protected clearColor = '#000';
  public screen = { x: 0, y: 0 };

  protected entities: Entity[] = [];

  protected namedEntites: { [name: string]: Entity } = {};
  protected cellSize = 64;

  public get sceneryMaps(): Readonly<SceneryMap[]> {
    return this.sMaps;
  }
  protected sMaps: SceneryMap[] = [];

  public get collisionMap(): Readonly<CollisionMap> {
    return this.cMap;
  }
  protected cMap: CollisionMap = CollisionMap.none;

  protected loadLevel({ entities, layers }: LevelConfig) {
    this.screen = { x: 0, y: 0 };
    this.entities = [];
    this.namedEntites = {};

    entities.forEach(({ EntityClass, x, y }) => {
      this.spawnEntity(EntityClass, x, y);
    });
    this.sortEntities();

    const collisionLayer = layers.find(({ name }) => name === 'collision');
    if (collisionLayer !== undefined) {
      const { data, tileSize } = collisionLayer;
      this.cMap = new CollisionMap(data, tileSize);
    }

    this.sMaps = layers
      .filter(({ name }) => name !== 'collision')
      .map(
        ({
          data,
          tileSize,
          tileSetName,
          name,
          repeat,
          foreground,
          distance,
        }) => {
          const map = new SceneryMap(
            data,
            tileSize,
            new SpriteSheet(tileSetName, tileSize, tileSize),
          );

          map.name = name;
          map.shouldRepeat = repeat;
          map.isForeground = foreground;
          map.distance = distance;

          return map;
        },
      );

    this.entities.forEach(entity => {
      entity.ready();
    });
  }

  protected spawnEntity(EntityClass: typeof Entity, x: number, y: number) {
    const entity = new EntityClass(x, y);

    this.entities.push(entity);
    if (entity.name) {
      if (this.namedEntites[entity.name]) {
        throw new Error(`Cannot have two entities with name: "${entity.name}"`);
      }

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

    this.sMaps.forEach(map => {
      if (map.isForeground) {
        return;
      }

      map.setScreenPos(this.screen.x, this.screen.y);
      map.draw();
    });

    this.drawEntities();
    // TODO: draw foreground maps
  }

  public getNamedEntity(name: string) {
    return this.namedEntites[name];
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
