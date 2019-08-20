import Bitmap from './lib/bitmap';
import Font, { Align } from './lib/font';
import Game from './lib/game';
import { main, system } from './lib/impact';

import './main.css';

import fontPath from './media/04b03.font.png';
import imgPath from './media/test.png';
import { sT } from './lib/util';

class MyGame extends Game {
  public font = new Font(fontPath);
  public img = new Bitmap(imgPath);

  public update() {
    super.update();
  }

  public draw() {
    super.draw();

    const hw = system.width / 2;
    const hh = system.height / 2;

    const { height: ih } = this.img;
    const scale = 16;
    const imgHeight = ih * scale;

    const { height: fh, lineSpacing } = this.font;
    const text = `\
It works!
Multiline too!`;
    const fontLines = text.split('\n').length;
    const fontHeight = (fh + lineSpacing) * (fontLines + 1);

    const totalHeight = imgHeight + fontHeight;

    this.font.print(text, hw, hh - totalHeight / 2, Align.Center);
    this.img.draw(
      0,
      0,
      this.img.width,
      this.img.height,
      hw - this.img.width * (scale / 2),
      hh - totalHeight / 2 + fontHeight,
      this.img.width * scale,
      this.img.height * scale,
    );
  }
}

main('#canvas', MyGame, 60, 320, 240, 2);
