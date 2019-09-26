import Game from './game';
import { Resource, system } from './impact';
import { rAF, cAF } from './util';

export default class Loader {
  private isDone = false;
  private frameId = 0;

  private unloadedPaths: string[] = [];
  private callback = (path: string, success: boolean) => {
    if (success) {
      const i = this.unloadedPaths.indexOf(path);
      i !== -1 && this.unloadedPaths.splice(i, 1);
    } else {
      throw new Error(`Failed to load resource: ${path}`);
    }
  };

  private drawStatus = 0;
  private draw = () => {
    const {
      unloadedPaths: { length: ul },
      resources: { length: rl },
    } = this;
    const { scale: s, width, height, context } = system;

    const w = width * 0.6;
    const h = height * 0.1;
    const x = width * 0.5 - w / 2;
    const y = height * 0.5 - h / 2;

    const status = 1 - ul / rl;
    this.drawStatus += (status - this.drawStatus) / 5;

    if (status === 1 && this.drawStatus > 0.99) {
      this.end();
      return;
    }

    this.frameId = rAF(this.draw);

    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#fff';
    context.fillRect(x * s, y * s, w * s, h * s);

    context.fillStyle = '#000';
    context.fillRect(x * s + s, y * s + s, w * s - s - s, h * s - s - s);

    context.fillStyle = '#fff';
    context.fillRect(x * s, y * s, w * s * this.drawStatus, h * s);
  };

  constructor(public GameClass: typeof Game, public resources: Resource[]) {
    this.unloadedPaths = resources.map(({ path }) => path);
  }

  public load() {
    system.clear();

    if (this.resources.length === 0) {
      this.end();
      return;
    }

    this.resources.forEach(resource => {
      this.loadResource(resource);
    });

    this.frameId = rAF(this.draw);
  }

  private end() {
    if (this.isDone) {
      return;
    }

    this.isDone = true;
    cAF(this.frameId);
    this.frameId = 0;

    system.setGame(this.GameClass);
  }

  private loadResource(resource: Resource) {
    resource.load(this.callback);
  }
}
