let nextId = 0;

export default class Entity {
  readonly id = nextId++;
  readonly name?: string;

  public zIndex = 0;
  public isActive = true;

  public size = { x: 16, y: 16 };
  public offset = { x: 0, y: 0 };

  public currPos = { x: 0, y: 0 };
  private prevPos = { x: 0, y: 0 };

  public get top() {
    return this.currPos.y - this.offset.y;
  }

  public get right() {
    return this.currPos.x - this.offset.x + this.size.x;
  }

  public get bottom() {
    return this.currPos.y - this.offset.y + this.size.y;
  }

  public get left() {
    return this.currPos.x - this.offset.x;
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

    // this.currPos.x += this.vel.x;
    // this.currPos.y += this.vel.y;
  }

  public draw() {}

  public isTouching(other: Entity) {
    return !(
      this.top >= other.bottom ||
      this.right <= other.left ||
      this.bottom <= other.top ||
      this.left >= other.right
    );
  }
}
