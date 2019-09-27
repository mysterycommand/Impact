import { system } from './impact';

type EntityConfig = {
  type: string;
  x: number;
  y: number;
};

type LayerConfig = {
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

type LevelConfig = {
  entities: EntityConfig[];
  layers: LayerConfig[];
};

export default class Game {
  protected clearColor = '#000';

  protected loadLevel(config: LevelConfig) {
    // TODO: @mysterycommand - implement this!!!
    console.log(JSON.stringify(config));
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
