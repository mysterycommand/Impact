import { useImage } from './image';
import { getPixels, once } from './util';

function getMetrics(image: HTMLImageElement): [number[], number[]] {
  const widthMap = [];
  const indices = [];
  const { data } = getPixels(image, 0, image.height - 1, image.width, 1);

  let currentWidth = 0;
  for (let i = 0; i < image.width; ++i) {
    const a = i * 4 + 3; // the index of the alpha channel
    if (data[a] > 127) {
      ++currentWidth;
      continue;
    }

    widthMap.push(currentWidth);
    indices.push(i - currentWidth);
    currentWidth = 0;
  }

  widthMap.push(currentWidth);
  indices.push(image.width - currentWidth);

  return [widthMap, indices];
}

const FIRST_CHAR_CODE = 32;

type FontOptions = {
  letterSpacing: number;
  lineSpacing: number;
};

export enum Align {
  Left,
  Center,
  Right,
}

const defaultOptions: FontOptions = {
  letterSpacing: 1,
  lineSpacing: 1,
};

export async function useFont(path: string, options?: FontOptions) {
  const { letterSpacing, lineSpacing } = { ...options, ...defaultOptions };
  const image = useImage(path);
  const charHeight = image.height - 2;

  const [widthMap, indices] = await new Promise(resolve => {
    once(image, 'load', event =>
      resolve(getMetrics(event.target as HTMLImageElement)),
    );
  });

  function printChar(
    ctx: CanvasRenderingContext2D,
    charCode: number,
    x: number,
    y: number,
  ): number {
    if (0 > charCode || charCode >= indices.length) {
      return 0;
    }

    const charX = indices[charCode];
    const charY = 0;

    const charWidth = widthMap[charCode];

    ctx.drawImage(
      image,
      charX,
      charY,
      charWidth,
      charHeight,
      x,
      y,
      charWidth,
      charHeight,
    );

    return widthMap[charCode] + letterSpacing;
  }

  return function print(
    ctx: CanvasRenderingContext2D,
    text: string,
    x = 0,
    y = 0,
    align = Align.Left,
  ) {
    // multiline
    if (text.includes('\n')) {
      text.split('\n').forEach((line, i) => {
        print(ctx, line, x, y + i * (charHeight + lineSpacing), align);
      });

      return;
    }

    const chars = text.split('');
    let nextX = x;
    let nextY = y;

    if (align !== Align.Left) {
      const width = chars.reduce((acc, char) => {
        return acc + widthMap[char.charCodeAt(0) - FIRST_CHAR_CODE];
      }, Math.max(0, letterSpacing * (text.length - 1)));

      nextX -= align === Align.Center ? width / 2 : width;
    }

    chars.forEach(char => {
      nextX += printChar(
        ctx,
        char.charCodeAt(0) - FIRST_CHAR_CODE,
        nextX,
        nextY,
      );
    });
  };
}
