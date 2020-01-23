import {
  abs,
  ceil,
  floor,
  max,
  min,
  sqrt,
  isBetween,
  isOutside,
} from '../math';

import BaseMap from './base-map';

type TileDef = {
  [key: number]: [number, number, number, number, boolean];
};

export type TraceResult = {
  collision: {
    x: boolean;
    y: boolean;
    slope: { x: number; y: number; nx: number; ny: number } | false;
  };
  tile: { x: number; y: number };
  pos: { x: number; y: number };
};

export default class CollisionMap extends BaseMap {
  // n.b. this *must* appear _before_ `none` below because the inherited
  // `constructor` needs to access this value ... truly wild stuff JavaScript!
  static readonly defaultTileDef: TileDef = {
    // TODO: support the full `defaultTileDef`
    // @see: ../../../orig/lib/impact/collision-map.js#L234
    12: [0, 0, 1, 0, false],
  };

  // TODO: make this into an interface that `NoCollisionMap` implements without
  // all the unnecessary prototype chain stuff ...
  static readonly none = new (class NoCollisionMap extends CollisionMap {
    public trace(x: number, y: number, vx: number, vy: number): TraceResult {
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

  public trace(
    x: number,
    y: number,
    vx: number,
    vy: number,
    w: number,
    h: number,
  ): TraceResult {
    const result: TraceResult = {
      collision: { x: false, y: false, slope: false },
      pos: { x, y },
      tile: { x: 0, y: 0 },
    };

    const steps = ceil(max(abs(vx), abs(vy) + 0.1) / this.tileSize);

    if (steps > 1) {
      let sx = vx / steps;
      let sy = vy / steps;

      new Array(steps).fill(true).some((_, i) => {
        this.traceStep(result, x, y, sx, sy, w, h, vx, vy, i);

        x = result.pos.x;
        y = result.pos.y;

        if (result.collision.x) {
          sx = 0;
          vx = 0;
        }

        if (result.collision.y) {
          sy = 0;
          vy = 0;
        }

        return result.collision.slope !== false;
      });
    } else {
      this.traceStep(result, x, y, vx, vy, w, h, vx, vy, 0);
    }

    return result;
  }

  private traceStep(
    result: TraceResult,
    x: number,
    y: number,
    sx: number,
    sy: number,
    w: number,
    h: number,
    vx: number,
    vy: number,
    i: number,
  ) {
    result.pos.x += sx;
    result.pos.y += sy;

    let t = 0;

    // horizontal collision (walls)
    if (sx !== 0) {
      const pxOffsetX = sx > 0 ? w : 0;
      const tileOffsetX = sx < 0 ? this.tileSize : 0;

      const firstTileY = max(floor(y / this.tileSize), 0);
      const lastTileY = min(ceil((y + h) / this.tileSize), this.height);
      const tileX = floor((result.pos.x + pxOffsetX) / this.tileSize);

      let prevTileX = floor((x + pxOffsetX) / this.tileSize);
      if (i > 0 || tileX === prevTileX || isOutside(0, this.width, prevTileX)) {
        prevTileX = -1;
      }

      if (isBetween(0, this.width, tileX)) {
        for (let tileY = firstTileY; tileY < lastTileY; ++tileY) {
          if (prevTileX !== -1) {
            t = this.data[tileY]?.[prevTileX];
            if (
              t &&
              isBetween(1, this.lastSlope, t, false, true) &&
              this.checkTileDef(result, t, prevTileX, tileY, x, y, w, h, vx, vy)
            ) {
              break;
            }
          }

          t = this.data[tileY]?.[tileX];
          if (
            (t && t === 1) ||
            t > this.lastSlope ||
            (t > 1 &&
              this.checkTileDef(result, t, tileX, tileY, x, y, w, h, vx, vy))
          ) {
            if (t > 1 && t <= this.lastSlope && result.collision.slope) {
              break;
            }

            // full tile collision
            result.collision.x = true;
            result.tile.x = t;
            result.pos.x = x = tileX * this.tileSize - pxOffsetX + tileOffsetX;
            vx = 0;
            break;
          }
        }
      }
    }

    // vertical collision (floor, ceiling)
    if (sy !== 0) {
      const pxOffsetY = sy > 0 ? h : 0;
      const tileOffsetY = sy < 0 ? this.tileSize : 0;

      const firstTileX = max(floor(result.pos.x / this.tileSize), 0);
      const lastTileX = min(
        ceil((result.pos.x + w) / this.tileSize),
        this.width,
      );
      const tileY = floor((result.pos.y + pxOffsetY) / this.tileSize);

      let prevTileY = floor((y + pxOffsetY) / this.tileSize);
      if (
        i > 0 ||
        tileY === prevTileY ||
        isOutside(0, this.height, prevTileY)
      ) {
        prevTileY = -1;
      }

      if (isBetween(0, this.height, tileY)) {
        for (let tileX = firstTileX; tileX < lastTileX; ++tileX) {
          if (prevTileY !== -1) {
            t = this.data[prevTileY]?.[tileX];
            if (
              t &&
              isBetween(1, this.lastSlope, t, false, true) &&
              this.checkTileDef(result, t, tileX, prevTileY, x, y, w, h, vx, vy)
            ) {
              break;
            }
          }

          t = this.data[tileY]?.[tileX];
          if (
            (t && t === 1) ||
            t > this.lastSlope ||
            (t > 1 &&
              this.checkTileDef(result, t, tileX, tileY, x, y, w, h, vx, vy))
          ) {
            if (t > 1 && t <= this.lastSlope && result.collision.slope) {
              break;
            }

            // full tile collision
            result.collision.y = true;
            result.tile.y = t;
            result.pos.y = tileY * this.tileSize - pxOffsetY + tileOffsetY;
            break;
          }
        }
      }
    }
  }

  private checkTileDef(
    result: TraceResult,
    t: number,
    tx: number,
    ty: number,
    x: number,
    y: number,
    w: number,
    h: number,
    vx: number,
    vy: number,
  ) {
    const def = this.tileDef[t];

    if (!def) {
      return false;
    }

    const [x1, y1, x2, y2, isSolid] = def;

    const lx = (tx + x1) * this.tileSize;
    const ly = (ty + y1) * this.tileSize;
    const lvx = (x2 - x1) * this.tileSize;
    const lvy = (y2 - y1) * this.tileSize;

    const cx = x + vx + (lvy < 0 ? w : 0) - lx;
    const cy = y + vy + (lvx > 0 ? h : 0) - ly;

    if (lvx * cy - lvy * cx > 0) {
      if (vx * -lvy + vy * lvx < 0) {
        return isSolid;
      }

      const length = sqrt(lvx * lvx + lvy * lvy);
      const nx = lvy / length;
      const ny = -lvx / length;

      const proj = cx * nx + cy * ny;
      const px = nx * proj;
      const py = ny * proj;

      if (px * px + py * py >= vx * vx + vy * vy) {
        return isSolid || lvx * (cy - vy) - lvy * (cx - vx) < 0.5;
      }

      result.pos.x = x + vx - px;
      result.pos.y = y + vy - py;
      result.collision.slope = { x: lvx, y: lvy, nx, ny };

      return true;
    }

    return false;
  }
}
