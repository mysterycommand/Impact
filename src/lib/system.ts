import { getEl, cAF, rAF } from './util';
import Game from './game';

export default class System {
  public context: CanvasRenderingContext2D;
  public game?: Game;
  public get isRunning() {
    return this.frameId !== -1;
  }

  private canvas: HTMLCanvasElement;
  private realWidth: number = this.width * this.scale;
  private realHeight: number = this.height * this.scale;
  private frameId = -1;
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
    readonly width: number,
    readonly height: number,
    readonly scale: number,
  ) {
    this.canvas = getEl(canvasId) as HTMLCanvasElement;
    this.canvas.width = this.realWidth;
    this.canvas.height = this.realHeight;
    this.canvas.style.imageRendering = 'crisp-edges';

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.context.imageSmoothingEnabled = false;
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
    this.frameId = -1;
  }
}
