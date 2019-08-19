import './main.css';

import Font, { Align } from './lib/font';
import Game from './lib/game';
import { main, system } from './lib/impact';

import fontPath from './media/04b03.font.png';
import testPath from './media/test.png';
import Bitmap from './lib/bitmap';

class MyGame extends Game {
  public font = new Font(fontPath);
  public test = new Bitmap(testPath);

  public update() {
    super.update();
  }

  public draw() {
    super.draw();

    const hw = system.width / 2;
    const hh = system.height / 2;

    const testScale = 16;
    const testHeight = this.test.height * testScale;
    const fontHeight = (this.font.height + this.font.lineSpacing) * 3;
    const totalHeight = testHeight + fontHeight;

    this.font.print(
      `\
It works!
Multiline too!`,
      hw,
      hh - totalHeight / 2,
      Align.Center,
    );

    this.test.draw(
      0,
      0,
      this.test.width,
      this.test.height,
      hw - this.test.width * (testScale / 2),
      hh - totalHeight / 2 + fontHeight,
      this.test.width * testScale,
      this.test.height * testScale,
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
