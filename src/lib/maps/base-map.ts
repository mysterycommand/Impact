const { floor } = Math;

export default class BaseMap {
  public name = '';

  constructor(
    readonly data: number[][] = [[]],
    readonly tileSize = 8,
    readonly width = data[0].length,
    readonly height = data.length,
    readonly pixelWidth = width * tileSize,
    readonly pixelHeight = height * tileSize,
  ) {}

  public getTile(x: number, y: number) {
    const tx = floor(x / this.tileSize);
    const ty = floor(y / this.tileSize);

    if (0 <= tx && tx < this.width && 0 <= ty && ty < this.height) {
      return this.data[ty][tx];
    }

    return 0;
  }

  public setTile(x: number, y: number, tile: number) {
    const tx = floor(x / this.tileSize);
    const ty = floor(y / this.tileSize);

    if (0 <= tx && tx < this.width && 0 <= ty && ty < this.height) {
      this.data[ty][tx] = tile;
    }
  }
}
