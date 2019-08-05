export function getEl(selector: string) {
  return document.querySelector(selector);
}
export function getEls(selector: string) {
  return document.querySelectorAll(selector);
}
export function newEl<K extends keyof HTMLElementTagNameMap>(tagName: K) {
  return document.createElement(tagName);
}

export const dpr = window.devicePixelRatio;
export const getPixels = (
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
): ImageData => {
  const canvas = newEl('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.imageRendering = 'crisp-edges';

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(image, -x, -y);
  return ctx.getImageData(0, 0, width, height);
};
