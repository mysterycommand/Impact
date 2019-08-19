import Game from './game';
import { Resource, system } from './impact';

export default class Loader {
  private unloadedPaths: string[] = [];

  constructor(public GameClass: typeof Game, public resources: Resource[]) {
    this.unloadedPaths = resources.map(({ path }) => path);
  }

  public load() {
    system.clear();
  }
}
