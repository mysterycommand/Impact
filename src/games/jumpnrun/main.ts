import Bitmap from '../../lib/bitmap';
import Font, { Align } from '../../lib/font';
import Game from '../../lib/game';
import { input, main, system } from '../../lib/impact';
import KeyCode from '../../lib/key-code';
import { query, on } from '../../lib/util';

import '../../main.css';

import { config } from './levels/title';

// media paths
import fontPath from './media/fredoka-one.font.png';
import heartFullPath from './media/heart-full.png';
import heartEmptyPath from './media/heart-empty.png';
import coinIconPath from './media/coin.png';
import titlePath from './media/title.png';

// resources (to load)
const fontResource = new Font(fontPath);
const heartFullResource = new Bitmap(heartFullPath);
const heartEmptyResource = new Bitmap(heartEmptyPath);
const coinIconResource = new Bitmap(coinIconPath);
const titleResource = new Bitmap(titlePath);

class MyGame extends Game {
  protected clearColor = '#d0f4f7';

  public font = fontResource;

  public heartFull = heartFullResource;
  public heartEmpty = heartEmptyResource;
  public coinIcon = coinIconResource;

  constructor() {
    super();

    this.font.letterSpacing = -2;
    // this.loadLevel(Grasslands);
  }

  public update() {
    super.update();
    // this.camera.follow(this.player);
  }

  public draw() {
    super.draw();
  }
}

class MyTitle extends Game {
  protected clearColor = '#d0f4f7';

  public font = fontResource;

  public title = titleResource;

  constructor() {
    super();

    this.font.letterSpacing = -2;

    input.bind(KeyCode.ArrowLeft, 'left');
    input.bind(KeyCode.ArrowRight, 'right');
    input.bind(KeyCode.KeyX, 'jump');
    input.bind(KeyCode.KeyC, 'shoot');

    this.loadLevel(config);
  }

  public update() {
    if (input.pressed('jump') || input.pressed('shoot')) {
      system.setGame(MyGame);
      return;
    }

    super.update();
  }

  public draw() {
    super.draw();

    const hw = system.width / 2;
    this.title.draw(
      0,
      0,
      this.title.width,
      this.title.height,
      hw - this.title.width / 2,
      60,
      this.title.width,
      this.title.height,
    );

    this.font.print('Press X or C to Play!', hw, 420, Align.Center);
  }
}

const { innerWidth: w, innerHeight: h } = window;
const canvasId = '#canvas';
const canvas = query(canvasId) as HTMLCanvasElement;

on(window, 'resize', ({ target }) => {
  const { innerWidth: w, innerHeight: h } = target as Window;

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  if (!system) {
    return;
  }

  system.resize(w, h);
});
window.dispatchEvent(new Event('resize'));

main(canvasId, MyTitle, 60, w, h, 1);
