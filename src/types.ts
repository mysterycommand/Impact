import Entity from './lib/entity';

export type EntityConfig = {
  EntityClass: typeof Entity;
  x: number;
  y: number;
};

export type LayerConfig = {
  name: string;
  width: number;
  height: number;
  linkWithCollision: boolean;
  visible: boolean;
  tilesetName: string;
  repeat: boolean;
  preRender: boolean;
  distance: string | number;
  tilesize: number;
  foreground: boolean;
  data: number[][];
};

export type LevelConfig = {
  entities: EntityConfig[];
  layers: LayerConfig[];
};
