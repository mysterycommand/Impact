import Bitmap from '../bitmap';
import { system } from '../impact';
import BaseMap from './base-map';

export default class SceneryMap extends BaseMap {
  readonly enabled = true;

  private scroll = { x: 0, y: 0 };
  public shouldRepeat = false;

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

  private drawTiled() {
    // let tile = 0;
    // let anim = null;

    const tileOffsetX = (this.scroll.x / this.tileSize) | 0;
    const tileOffsetY = (this.scroll.y / this.tileSize) | 0;

    const pxOffsetX = this.scroll.x % this.tileSize;
    const pxOffsetY = this.scroll.y % this.tileSize;

    const pxMinX = -pxOffsetX - this.tileSize;
    const pxMinY = -pxOffsetY - this.tileSize;

    const pxMaxX = system.width + this.tileSize - pxOffsetX;
    const pxMaxY = system.height + this.tileSize - pxOffsetY;

    for (
      let mapY = -1, pxY = pxMinY;
      pxY < pxMaxY;
      ++mapY, pxY += this.tileSize
    ) {
      let tileY = mapY + tileOffsetY;

      if (tileY < 0 || this.height <= tileY) {
        if (!this.shouldRepeat) {
          continue;
        }

        // TODO: is there a clearer way to do this?
        tileY = ((tileY % this.height) + this.height) % this.height;
      }

      for (
        let mapX = -1, pxX = pxMinX;
        pxX < pxMaxX;
        ++mapX, pxX += this.tileSize
      ) {
        let tileX = mapX + tileOffsetX;

        if (tileX < 0 || this.width <= tileX) {
          if (!this.shouldRepeat) {
            continue;
          }

          // TODO: is there a clearer way to do this?
          tileX = ((tileX % this.width) + this.width) % this.width;
        }

        if (this.data[tileY][tileX]) {
          // tile = this.data[tileY][tileX];

          // if (this.anims[tile - 1]) {
          //   anim = this.anims[tile - 1];
          //   anim.draw(pxX, pxY);
          //   return;
          // }

          this.tileSet.draw(
            0,
            0,
            this.tileSize,
            this.tileSize,
            pxX,
            pxY,
            this.tileSize,
            this.tileSize,
          );
        }
      }
    }
  }
}
