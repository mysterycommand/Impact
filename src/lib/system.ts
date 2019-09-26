import { query, cAF, rAF } from './util';
import Game from './game';

export default class System {
  public context: CanvasRenderingContext2D;
  public game?: Game;
  public get isRunning() {
    return this.frameId !== -1;
  }

  private canvas: HTMLCanvasElement;
  private realWidth = this.width * this.scale;
  private realHeight = this.height * this.scale;
  private frameId = 0;
  private run = (time: DOMHighResTimeStamp) => {
    if (!this.game) {
      this.isRunning && this.stop();
      return;
    }

    this.frameId = rAF(this.run);
    this.game.run();
  };

  constructor(
    readonly canvasId: string,
    readonly fps: number,
    public width: number,
    public height: number,
    public scale: number,
  ) {
    this.canvas = query(canvasId) as HTMLCanvasElement;
    this.resize(width, height, scale);
    this.canvas.style.imageRendering = 'crisp-edges';

    this.context = this.canvas.getContext('2d')!;
    this.context.imageSmoothingEnabled = false;
  }

  public resize(width: number, height: number, scale = this.scale) {
    this.width = width;
    this.height = height;
    this.scale = scale;

    this.realWidth = this.width * this.scale;
    this.realHeight = this.height * this.scale;

    this.canvas.width = this.realWidth;
    this.canvas.height = this.realHeight;
  }

  public clear(color = '#000') {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.realWidth, this.realHeight);
  }

  public setGame(GameClass: typeof Game) {
    this.game = new GameClass();
    this.start();
  }

  private start() {
    this.isRunning && this.stop();
    this.frameId = rAF(this.run);
  }

  private stop() {
    cAF(this.frameId);
    this.frameId = 0;
  }
}
