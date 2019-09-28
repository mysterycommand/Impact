let nextId = 0;

export default class Entity {
  readonly id = nextId++;
  readonly name?: string;

  public zIndex = 0;
  public isActive = true;

  public size = { x: 16, y: 16 };
  public currPos = { x: 0, y: 0 };
  private prevPos = { x: 0, y: 0 };

  constructor(x: number, y: number) {
    this.currPos.x = this.prevPos.x = x;
    this.currPos.y = this.prevPos.y = y;
  }

  public ready() {
    console.log(this.toString());
  }

  public update() {
    this.prevPos.x = this.currPos.x;
    this.prevPos.y = this.currPos.y;

    // this.currPos.x += this.vel.x;
    // this.currPos.y += this.vel.y;
  }

  public draw() {}

  private toString() {
    return `[entity ${this.constructor.name}]`;
  }
}
