import { getEl } from './util';

export default class System {
  private canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  private realWidth: number = this.width * this.scale;
  private realHeight: number = this.height * this.scale;

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
}
