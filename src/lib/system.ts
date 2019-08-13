import { getEl } from './util';

type SystemOptions = {
  fps: number;
  width: number;
  height: number;
  scale: number;
};

const defaultOptions: SystemOptions = {
  fps: 30,
  width: 320,
  height: 240,
  scale: 1,
};

export function useSystem(
  canvasSelector: string,
  options?: Partial<SystemOptions>,
) {
  const { fps, width, height, scale } = { ...options, ...defaultOptions };

  const canvas = getEl(canvasSelector) as HTMLCanvasElement;
  const realWidth = width * scale;
  const realHeight = height * scale;
  canvas.width = realWidth;
  canvas.height = realHeight;

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  return { fps, canvas, context };
}
