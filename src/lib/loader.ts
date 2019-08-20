import Game from './game';
import { Resource, system } from './impact';
import { rAF, cAF, sT } from './util';

export default class Loader {
  private isDone = false;
  private frameId = -1;

  private unloadedPaths: string[] = [];
  private callback = (path: string, success: boolean) => {
    if (success) {
      const i = this.unloadedPaths.indexOf(path);
      i !== -1 && this.unloadedPaths.splice(i, 1);
    } else {
      throw new Error(`Failed to load resource: ${path}`);
    }

    if (this.unloadedPaths.length === 0) {
      sT(() => this.end(), 200);
    }
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

    this.frameId = rAF(this.draw.bind(this));
  }

  private end() {
    if (this.isDone) {
      return;
    }

    this.isDone = true;
    cAF(this.frameId);
    this.frameId = -1;

    system.setGame(this.GameClass);
  }

  private loadResource(resource: Resource) {
    resource.load(this.callback);
  }

  private draw() {
    const {
      unloadedPaths: { length: ul },
      resources: { length: rl },
    } = this;
    const { scale, width, height, context } = system;

    const w = width * 0.6;
    const h = height * 0.1;
    const x = width * 0.5 - w / 2;
    const y = height * 0.5 - h / 2;

    const status = 1 - ul / rl;

    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#fff';
    context.fillRect(x * scale, y * scale, w * scale, h * scale);

    context.fillStyle = '#000';
    context.fillRect(
      x * scale + scale,
      y * scale + scale,
      w * scale - scale - scale,
      h * scale - scale - scale,
    );

    console.log(status);
    context.fillStyle = '#fff';
    context.fillRect(x * scale, y * scale, w * scale * status, h * scale);
  }
}
