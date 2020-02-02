import Entity from '../../../lib/entity';

export default class Hurt extends Entity {
  public damage = 1;

  public update() {}

  public triggeredBy(entity: Entity) {
    entity.receiveDamage(this.damage);
  }
}
