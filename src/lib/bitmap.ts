import { ready, resources, system, LoadCallback, Resource } from './impact';
import { getImageData, offscreenCanvas } from './util';

const { floor, round } = Math;

export default class Bitmap implements Resource {
  public static cache: Map<string, Bitmap> = new Map();
  public static drawCount = 0;

  /**
   * `imageSource` should _technically_ be any valid `CanvasImageSource` but
   * `SVGImageElement` is omitted because it's `width` and `height` properties
   * are of type `SVGAnimatedLength` and I don't want to deal with converting
   * those to numbers for what I think is probably a small use case
   *
   * @see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasImageSource
   *
   * @type {(HTMLImageElement
   *     | HTMLVideoElement
   *     | HTMLCanvasElement
   *     | ImageBitmap
   *     | OffscreenCanvas)}
   *
   * @memberof Bitmap
   */
  public imageSource?:
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | ImageBitmap
    | OffscreenCanvas;
  public width = 0;
  public height = 0;

  public isLoaded = false;
  private callback?: LoadCallback;

  public constructor(readonly path: string) {
    if (Bitmap.cache.has(path)) {
      return Bitmap.cache.get(path) as Bitmap;
    }

    this.load();
  }

  public load(callback?: LoadCallback) {
    if (this.isLoaded) {
      callback && callback(this.path, true);
      return;
    }

    if (!this.isLoaded && ready) {
      this.callback = callback;

      this.imageSource = new Image();
      this.imageSource.addEventListener('load', this.onLoad.bind(this));
      this.imageSource.addEventListener('error', this.onError.bind(this));
      this.imageSource.src = this.path;
    } else {
      resources.push(this);
    }

    Bitmap.cache.set(this.path, this);
  }

  public draw(
    sx: number = 0,
    sy: number = 0,
    sw: number = this.width,
    sh: number = this.height,
    dx: number = 0,
    dy: number = 0,
    dw: number = this.width,
    dh: number = this.height,
  ) {
    if (!this.imageSource) {
      return;
    }

    const { context, scale } = system;
    context.drawImage(
      this.imageSource,
      sx * scale,
      sy * scale,
      sw * scale,
      sh * scale,
      round(dx) * scale,
      round(dy) * scale,
      dw * scale,
      dh * scale,
    );

    Bitmap.drawCount++;
  }

  protected onLoad(/* event: Event */) {
    if (!this.imageSource) {
      return;
    }

    // TODO: this seems redundant, create a getter to reach
    // into `this.data` or just expect consumers to do it
    this.width = this.imageSource.width;
    this.height = this.imageSource.height;
    this.isLoaded = true;

    system.scale != 1 && this.resize(system.scale);
    this.callback && this.callback(this.path, true);
  }

  protected onError(/* event: Event */) {
    this.isLoaded = false;
    this.callback && this.callback(this.path, false);
  }

  private resize(scale: number) {
    if (!this.imageSource) {
      return;
    }

    const { data: sourceData } = getImageData(
      this.imageSource as CanvasImageSource,
      0,
      0,
      this.width,
      this.height,
    );

    const { width, height } = this;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const [canvas, context] = offscreenCanvas(scaledWidth, scaledHeight);
    const target = context.getImageData(0, 0, scaledWidth, scaledHeight);
    const { data: targetData } = target;

    for (let y = 0; y < scaledHeight; ++y) {
      for (let x = 0; x < scaledWidth; ++x) {
        const i = (floor(y / scale) * width + floor(x / scale)) * 4;
        const j = (y * scaledWidth + x) * 4;

        targetData[j + 0] = sourceData[i + 0];
        targetData[j + 1] = sourceData[i + 1];
        targetData[j + 2] = sourceData[i + 2];
        targetData[j + 3] = sourceData[i + 3];
      }
    }

    context.putImageData(target, 0, 0);
    this.imageSource = canvas;
  }
}
