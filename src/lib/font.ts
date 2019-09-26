import Bitmap from './bitmap';
import { getImageData } from './util';

const { min } = Math;

const FIRST_CHAR_CODE = 32;

export enum Align {
  Left,
  Center,
  Right,
}

export default class Font extends Bitmap {
  public letterSpacing = 1;
  public lineSpacing = 1;

  private widthMap: number[] = [];
  private indices: number[] = [];

  protected onLoad(/* event: Event */) {
    this.getMetrics();
    super.onLoad();
    this.height -= 2;
  }

  public print(text: string, x = 0, y = 0, align = Align.Left) {
    if (!this.imageSource) {
      return;
    }

    const { height, letterSpacing, lineSpacing, widthMap } = this;

    // multiline
    if (text.includes('\n')) {
      text.split('\n').forEach((line, i) => {
        this.print(line, x, y + i * (height + lineSpacing), align);
      });

      return;
    }

    const chars = text.split('');
    let nextX = x;

    // alignment
    if (align !== Align.Left) {
      const width = chars.reduce((acc, char) => {
        return acc + widthMap[char.charCodeAt(0) - FIRST_CHAR_CODE];
      }, min(0, letterSpacing * text.length));
      nextX -= align === Align.Center ? width / 2 : width;
    }

    chars.forEach(char => {
      nextX += this.printChar(char.charCodeAt(0) - FIRST_CHAR_CODE, nextX, y);
    });
  }

  private printChar(charCode: number, x: number, y: number): number {
    if (!this.imageSource) {
      return 0;
    }

    const { height, letterSpacing, widthMap, indices } = this;

    if (charCode < 0 || indices.length <= charCode) {
      // charCode is *outside* the bounds of this font
      return 0;
    }

    const cx = indices[charCode];
    const cy = 0;
    const cw = widthMap[charCode];
    this.draw(cx, cy, cw, height, x, y, cw, height);

    return widthMap[charCode] + letterSpacing;
  }

  private getMetrics() {
    if (!this.imageSource) {
      return;
    }

    const {
      /**
       * pulling `width` and `height` off of `imageSource` here because this is
       * run _before_ `super.onLoad` and works on the un`resize`d `imageSource`
       */
      imageSource: { width, height },
      widthMap,
      indices,
    } = this;
    const { data } = getImageData(this.imageSource, 0, height - 1, width, 1);

    let currentWidth = 0;
    for (let i = 0; i < width; ++i) {
      const a = i * 4 + 3; // the index of the alpha channel

      if (data[a] > 127) {
        ++currentWidth;
        continue;
      }

      if (data[a] < 128 && currentWidth) {
        widthMap.push(currentWidth);
        indices.push(i - currentWidth);
        currentWidth = 0;
      }
    }

    widthMap.push(currentWidth);
    indices.push(width - currentWidth);
  }
}
