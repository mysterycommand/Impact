export function query(selector: string) {
  return document.querySelector(selector);
}
export function queryAll(selector: string) {
  return document.querySelectorAll(selector);
}
export function createEl<K extends keyof HTMLElementTagNameMap>(tagName: K) {
  return document.createElement(tagName);
}

export const {
  devicePixelRatio: dpr,
  requestAnimationFrame: rAF,
  cancelAnimationFrame: cAF,
  setTimeout: sT,
  setInterval: sI,
  clearInterval: cI,
} = window;

export function offscreenCanvas(
  width: number,
  height: number,
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = createEl('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.imageRendering = 'crisp-edges';

  const context = canvas.getContext('2d')!;
  context.imageSmoothingEnabled = false;

  return [canvas, context];
}

export const getImageData = (
  image: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number,
): ImageData => {
  const [, context] = offscreenCanvas(width, height);
  context.drawImage(image, -x, -y);
  return context.getImageData(0, 0, width, height);
};

type Listener<K extends keyof HTMLElementEventMap> = (
  event: HTMLElementEventMap[K],
) => any;

export function on<T extends EventTarget, K extends keyof HTMLElementEventMap>(
  target: T,
  type: K,
  listener: Listener<K>,
  options?: boolean | AddEventListenerOptions,
) {
  target.addEventListener(type, listener as EventListener, options);
}

export function off<T extends EventTarget, K extends keyof HTMLElementEventMap>(
  target: T,
  type: K,
  listener: Listener<K>,
  options?: boolean | EventListenerOptions,
) {
  target.removeEventListener(type, listener as EventListener, options);
}

export function once<
  T extends EventTarget,
  K extends keyof HTMLElementEventMap
>(
  target: T,
  type: K,
  listener: Listener<K>,
  options?: boolean | AddEventListenerOptions,
) {
  const opts = typeof options === 'boolean' ? { capture: options } : options;
  on(target, type, listener as EventListener, { ...opts, once: true });
}
