import { system } from './impact';
import { TraceResult } from './maps/collision-map';
import {
  abs,
  atan2,
  min,
  max,
  /* round, */
  toRadians,
  isBetween,
} from './math';
import SpriteSheet from './sprite-sheet';
import SpriteSheetAnimation from './sprite-sheet-animation';

let nextId = 0;

export const enum Type {
  None = 0b0000,
  Friend = 0b0001,
  Enemy = 0b0010,
  Both = 0b0011,
}

export const enum Collides {
  Never = 0b0000,
  Lite = 0b0001,
  Passive = 0b0010,
  Active = 0b0100,
  Fixed = 0b1000,
}

export const enum Axis {
  X = 'x',
  Y = 'y',
}

export default class Entity {
  readonly id = nextId++;
  readonly name?: string;

  public type = Type.None;
  public checksAgainst = Type.None;
  public collides = Collides.Never;

  public zIndex = 0;
  public isActive = true;

  public size = { x: 16, y: 16 };
  public offset = { x: 0, y: 0 };

  public currPos = { x: 0, y: 0 };
  private prevPos = { x: 0, y: 0 };

  public vel = { x: 0, y: 0 };
  public maxVel = { x: 100, y: 100 };

  public acc = { x: 0, y: 0 };
  public friction = { x: 0, y: 0 };

  public gravityFactor = 1;

  public isStanding = false;
  public standingSlope = { min: toRadians(44), max: toRadians(136) };

  public bounciness = 0;
  public minBounce = 40;

  public spriteSheet?: SpriteSheet;
  public currAnim?: SpriteSheetAnimation;
  public anims: {
    [name: string]: SpriteSheetAnimation;
  } = {};

  public get currTop() {
    return this.currPos.y - this.offset.y - (system?.game?.screen.y || 0);
  }

  public get currRight() {
    return this.currPos.x - this.offset.x + this.size.x;
  }

  public get currBottom() {
    return this.currPos.y - this.offset.y + this.size.y;
  }

  public get currLeft() {
    return this.currPos.x - this.offset.x - (system?.game?.screen.x || 0);
  }

  public get prevTop() {
    return this.prevPos.y - this.offset.y;
  }

  public get prevRight() {
    return this.prevPos.x - this.offset.x + this.size.x;
  }

  public get prevBottom() {
    return this.prevPos.y - this.offset.y + this.size.y;
  }

  public get prevLeft() {
    return this.prevPos.x - this.offset.x;
  }

  constructor(x: number, y: number) {
    this.currPos.x = this.prevPos.x = x;
    this.currPos.y = this.prevPos.y = y;
  }

  public toString() {
    return `[entity ${this.constructor.name}]`;
  }

  public ready() {
    console.log(this.toString());
  }

  public update() {
    this.prevPos.x = this.currPos.x;
    this.prevPos.y = this.currPos.y;

    const { game, tick } = system;
    if (!game) {
      throw new Error('Tried to update without a game!');
    }

    this.vel.y += (game.gravity || 0) * tick * this.gravityFactor;
    this.vel.x = this.getVel(
      this.vel.x,
      this.acc.x,
      this.friction.x,
      this.maxVel.x,
    );
    this.vel.y = this.getVel(
      this.vel.y,
      this.acc.y,
      this.friction.y,
      this.maxVel.y,
    );

    // movement & collision
    const mx = this.vel.x * tick;
    const my = this.vel.y * tick;
    const result = game.collisionMap.trace(
      this.currPos.x,
      this.currPos.y,
      mx,
      my,
      this.size.x,
      this.size.y,
    );
    this.handleTrace(result);

    this.currAnim?.update();
  }

  public draw() {
    this.currAnim?.draw(this.currLeft, this.currTop);

    /**
     * DEBUG DRAW!
     */
    // system.context.strokeStyle = 'red';
    // system.context.lineWidth = 1.0;
    // system.context.strokeRect(
    //   (/* round( */this.currPos.x) - (system.game?.screen.x || 0)) * system.scale -
    //     0.5,
    //   (/* round( */this.currPos.y) - (system.game?.screen.y || 0)) * system.scale -
    //     0.5,
    //   this.size.x * system.scale,
    //   this.size.y * system.scale,
    // );
  }

  public check(other: Entity) {}
  public collideWith(other: Entity, axis: Axis) {}

  public isTouching(other: Entity) {
    return !(
      this.currTop >= other.currBottom ||
      this.currRight <= other.currLeft ||
      this.currBottom <= other.currTop ||
      this.currLeft >= other.currRight
    );
  }

  public addAnim(name: string, spf: number, frames: number[], stop = false) {
    if (!this.spriteSheet) {
      throw new Error(
        `No sprite sheet for animation "${name}" in ${this.toString()}`,
      );
    }

    const anim = new SpriteSheetAnimation(this.spriteSheet, spf, frames, stop);
    this.anims[name] = anim;

    if (!this.currAnim) {
      this.currAnim = anim;
    }

    return anim;
  }

  protected handleTrace({
    collision: { x, y, slope },
    pos: { x: px, y: py },
  }: TraceResult) {
    this.isStanding = false;

    if (x) {
      if (this.bounciness > 0 && abs(this.vel.x) > this.minBounce) {
        this.vel.x *= -this.bounciness;
      } else {
        this.vel.x = 0;
      }
    }

    if (y) {
      if (this.bounciness > 0 && abs(this.vel.y) > this.minBounce) {
        this.vel.y *= -this.bounciness;
      } else {
        this.isStanding = this.vel.y > 0;
        this.vel.y = 0;
      }
    }

    if (slope !== false) {
      const { x, y, nx, ny } = slope;

      if (this.bounciness > 0) {
        const proj = this.vel.x * nx + this.vel.y * ny;

        this.vel.x = (this.vel.x - nx * proj * 2) * this.bounciness;
        this.vel.y = (this.vel.y - ny * proj * 2) * this.bounciness;
      } else {
        const lsq = x * x + y * y;
        const dot = (this.vel.x * x + this.vel.y * y) / lsq;

        this.vel.x = x * dot;
        this.vel.y = y * dot;

        const angle = atan2(x, y);
        this.isStanding = isBetween(
          this.standingSlope.min,
          this.standingSlope.max,
          angle,
          false,
          false,
        );
      }
    }

    this.currPos.x = px;
    this.currPos.y = py;
  }

  private getVel(v: number, a: number, f: number, m: number) {
    const { tick } = system;

    if (a !== 0) {
      return min(max(-m, v + a * tick), m);
    }

    if (f !== 0) {
      const d = f * tick;

      if (v - d > 0) {
        return v - d;
      }

      if (v + d < 0) {
        return v + d;
      }

      return 0;
    }

    return min(max(-m, v), m);
  }
}

/**
 * TODO: maybe cache the results here like:
 * ```
 * if (weakEntities[`${entity.id}:${other.id}`]) {
 *   return weakEntities[`${entity.id}:${other.id}`];
 * }
 * ```
 * ... but when/how would I need to clean up the cached comparisons?
 */
function getWeakEntity(entity: Entity, other: Entity): Entity | void {
  if (entity.collides === Collides.Lite || other.collides === Collides.Fixed) {
    return entity;
  }

  if (other.collides === Collides.Lite || entity.collides === Collides.Fixed) {
    return other;
  }
}

function separateOnX(entity: Entity, other: Entity) {
  // const penX = entity.currRight - other.currLeft;
  const weak = getWeakEntity(entity, other);

  if (weak) {
    const strong = entity === weak ? other : entity;
    weak.vel.x = -weak.vel.x * weak.bounciness + strong.vel.x;

    // weak.currPos.x = trace(
    //   weak.currPos.x,
    //   weak.currPos.y,
    //   entity === weak ? -penX : penX,
    //   0,
    //   weak.size.x,
    //   weak.size.y,
    // ).currPos.x;
    return;
  }

  const halfVel = (entity.vel.x - other.vel.x) / 2;
  entity.vel.x = -halfVel;
  other.vel.x = halfVel;

  // entity.currPos.x = floor(
  //   trace(
  //     entity.currPos.x,
  //     entity.currPos.y,
  //     -penX / 2,
  //     0,
  //     entity.size.x,
  //     entity.size.y,
  //   ).currPos.x,
  // );

  // other.currPos.x = ceil(
  //   trace(
  //     other.currPos.x,
  //     other.currPos.y,
  //     penX / 2,
  //     0,
  //     other.size.x,
  //     other.size.y,
  //   ).currPos.x,
  // );
}

function separateOnY(entity: Entity, other: Entity) {
  // const penY = entity.currBottom - other.currTop;
  const weak = getWeakEntity(entity, other);

  // let velX = 0;

  if (weak) {
    const strong = entity === weak ? other : entity;
    weak.vel.y = -weak.vel.y * weak.bounciness + strong.vel.y;

    // TODO: something about riding on a platform?

    // const respPos = trace(
    //   weak.currPos.x,
    //   weak.currPos.y,
    //   velX,
    //   entity === weak ? -penY : penY,
    //   weak.size.x,
    //   weak.size.y,
    // ).currPos;
    //
    // weak.currPos.x = respPos.x;
    // weak.currPos.y = respPos.y;
    return;
  }

  // TODO: handle bottom entity (other) "standing"
  // shouldn't we be able to handle this the same as if other is "strong"?

  const halfVel = (entity.vel.y - other.vel.y) / 2;
  entity.vel.y = -halfVel;
  other.vel.y = halfVel;

  // TODO: "tick" should go in system? "ideal time"? "delta"?
  // velX = other.vel.x * (1000 / 60);

  // entity.currPos.y = trace(
  //   entity.currPos.x,
  //   entity.currPos.y,
  //   velX,
  //   -penY / 2,
  //   entity.size.x,
  //   entity.size.y,
  // ).currPos.y;

  // other.currPos.y = trace(
  //   other.currPos.x,
  //   other.currPos.y,
  //   0,
  //   penY / 2,
  //   other.size.x,
  //   other.size.y,
  // ).currPos.y;
}

function solveCollision(entity: Entity, other: Entity) {
  if (entity.prevRight > other.prevLeft && entity.prevLeft < other.prevRight) {
    entity.prevTop < other.prevTop
      ? separateOnY(entity, other)
      : separateOnY(other, entity);

    entity.collideWith(other, Axis.Y);
    other.collideWith(entity, Axis.Y);

    return;
  }

  if (entity.prevBottom > other.prevTop && entity.prevTop < other.prevBottom) {
    entity.prevLeft < other.prevLeft
      ? separateOnX(entity, other)
      : separateOnX(other, entity);

    entity.collideWith(other, Axis.X);
    other.collideWith(entity, Axis.X);

    return;
  }
}

export function checkPair(entity: Entity, other: Entity) {
  if (entity.checksAgainst & other.type) {
    entity.check(other);
  }

  if (other.checksAgainst & entity.type) {
    other.check(entity);
  }

  if (
    entity.collides !== Collides.Never &&
    other.collides !== Collides.Never &&
    entity.collides + other.collides > Collides.Active
  ) {
    solveCollision(entity, other);
  }
}
