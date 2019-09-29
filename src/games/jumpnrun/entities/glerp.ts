import Entity, { Type, Collides } from '../../../lib/entity';

export default class Glerp extends Entity {
  public size = { x: 40, y: 28 };
  public offset = { x: 24, y: 0 };

  public type = Type.Enemy;
  public checksAgainst = Type.Friend;
  public collides = Collides.Passive;

  constructor(x: number, y: number) {
    super(x, y);
  }
}
