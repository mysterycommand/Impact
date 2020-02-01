import Entity, { EntitySettings } from './lib/entity';

export type EntityConfig = {
  EntityClass: typeof Entity;
  x: number;
  y: number;
  settings?: EntitySettings;
};

export type LayerConfig = {
  name: string;
  width: number;
  height: number;
  linkWithCollision: boolean;
  visible: boolean | number;
  tileSetName: string;
  repeat: boolean;
  preRender: boolean;
  distance: number;
  tileSize: number;
  foreground: boolean;
  data: number[][];
};

export type LevelConfig = {
  entities: EntityConfig[];
  layers: LayerConfig[];
};
