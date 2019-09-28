let nextId = 0;

export default class Entity {
  readonly id = nextId++;
  readonly name?: string;

  public zIndex = 0;

  private currPos = { x: 0, y: 0 };
  private prevPos = { x: 0, y: 0 };

  constructor(x: number, y: number) {
    this.currPos.x = this.prevPos.x = x;
    this.currPos.y = this.prevPos.y = y;
  }

  public ready() {
    console.log(this.toString());
  }

  private toString() {
    return `[entity ${this.constructor.name}]`;
  }
}
