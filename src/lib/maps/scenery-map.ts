import BaseMap from './base-map';
import Bitmap from '../bitmap';

export default class SceneryMap extends BaseMap {
  readonly enabled = true;

  constructor(
    readonly data: number[][] = [[]],
    readonly tileSize = 8,
    private tileSet: Bitmap,
  ) {
    super(data, tileSize);
  }

  public draw() {
    if (!this.tileSet.isLoaded || !this.enabled) {
      return;
    }

    this.drawTiled();
  }

  private drawTiled() {}
}
