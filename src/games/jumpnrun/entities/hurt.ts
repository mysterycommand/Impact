import Entity from '../../../lib/entity';
// import Trigger from './trigger';

export default class Hurt extends Entity {
  public size = { x: 32, y: 32 };
  // private damage = 10;

  public update() {}

  public triggeredBy(/* entity: Entity, trigger: Trigger */) {
    // entity.receiveDamage(this.damage, this);
  }
}
