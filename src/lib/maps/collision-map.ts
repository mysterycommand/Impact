import BaseMap from './base-map';

const { max } = Math;

type TileDef = {
  [key: number]: [number, number, number, number, boolean];
};

export default class CollisionMap extends BaseMap {
  // n.b. this *must* appear _before_ `none` below because the inherited
  // `constructor needs to access this value ... truly wild stuff JavaScript!
  static readonly defaultTileDef: TileDef = {
    // TODO: support the full `defaultTileDef`
    // @see: ../../../orig/lib/impact/collision-map.js#L234
    12: [0, 0, 1, 0, false],
  };

  // TODO: make this into an interface that `NoCollisionMap` implements without
  // all the unnecessary prototype chain stuff ...
  static readonly none = new (class NoCollisionMap extends CollisionMap {
    trace(x: number, y: number, vx: number, vy: number) {
      return {
        collision: { x: false, y: false, slope: false },
        pos: { x: x + vx, y: y + vy },
        tile: { x: 0, y: 0 },
      };
    }
  })();

  private lastSlope = 1;

  constructor(
    readonly data: number[][] = [[]],
    readonly tileSize = 8,
    readonly tileDef = CollisionMap.defaultTileDef,
  ) {
    super(data, tileSize);

    this.lastSlope = max(
      ...Object.keys(tileDef)
        .map(t => parseInt(t, 10))
        .concat(this.lastSlope),
    );
  }
}
