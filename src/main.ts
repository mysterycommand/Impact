import './main.css';

import Font, { Align } from './lib/font';
import Game from './lib/game';
import { main, system } from './lib/impact';

import fontPath from './media/04b03.font.png';
import imgPath from './media/test.png';
import Bitmap from './lib/bitmap';

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

    const imgScale = 16;
    const imgHeight = this.img.height * imgScale;
    const fontHeight = (this.font.height + this.font.lineSpacing) * 3;
    const totalHeight = imgHeight + fontHeight;

    this.font.print(
      `\
It works!
Multiline too!`,
      hw,
      hh - totalHeight / 2,
      Align.Center,
    );

    this.img.draw(
      0,
      0,
      this.img.width,
      this.img.height,
      hw - this.img.width * (imgScale / 2),
      hh - totalHeight / 2 + fontHeight,
      this.img.width * imgScale,
      this.img.height * imgScale,
    );
  }
}

main('#canvas', MyGame, 60, 320, 240, 2);

/**
 * testing
 */
(async () => {
  const game = new MyGame();
  await new Promise(resolve => setTimeout(resolve, 16));
  game.draw();
})();
