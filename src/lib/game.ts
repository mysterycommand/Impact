import { system } from './impact';

export default class Game {
  protected clearColor = '#000';

  public run() {
    this.update();
    this.draw();
  }

  public update() {}

  public draw() {
    system.clear(this.clearColor);
  }
}
