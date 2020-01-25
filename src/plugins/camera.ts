import Entity from '../lib/entity';
import { system } from '../lib/impact';
import { min, max } from '../lib/math';

export default class Camera {
  public trap = {
    pos: { x: 0, y: 0 },
    size: { x: 16, y: 16 },
  };
  public max = { x: 0, y: 0 };

  public offset = { x: 0, y: 0 };
  public lookAhead = { x: 0, y: 0 };

  private currPos = { x: 0, y: 0 };
  private currLookAhead = { x: 0, y: 0 };

  constructor(ox: number, oy: number, public damping = 5) {
    this.offset.x = ox;
    this.offset.y = oy;
  }

  public set({ currPos: { x: px, y: py }, size: { x: sx, y: sy } }: Entity) {
    this.trap.pos.x = px - sx / 2;
    this.trap.pos.y = py + sy - this.trap.size.y;

    this.currPos.x = this.trap.pos.x - this.offset.x;
    this.currPos.y = this.trap.pos.y - this.offset.y;

    this.currLookAhead.x = 0;
    this.currLookAhead.y = 0;
  }

  public follow({ currPos: { x: px, y: py }, size: { x: sx, y: sy } }: Entity) {
    this.currPos.x = this.move('x', px, sx);
    this.currPos.y = this.move('y', py, sy);

    const { game } = system;
    if (!game) {
      throw new Error('Camera tried to follow without a game!');
    }

    game.screen.x = this.currPos.x;
    game.screen.y = this.currPos.y;
  }

  private move(axis: 'x' | 'y', p: number, s: number) {
    if (p < this.trap.pos[axis]) {
      this.trap.pos[axis] = p;
      this.currLookAhead[axis] = this.lookAhead[axis];
    } else if (p + s > this.trap.pos[axis] + this.trap.size[axis]) {
      this.trap.pos[axis] = p + s - this.trap.size[axis];
      this.currLookAhead[axis] = -this.lookAhead[axis];
    }

    const v =
      this.currPos[axis] -
      (this.currPos[axis] -
        this.trap.pos[axis] +
        this.offset[axis] +
        this.currLookAhead[axis]) *
        system.tick *
        this.damping;
    return min(max(0, v), this.max[axis]);
  }
}
