import Font, { Align } from '../../lib/font';
import Game from '../../lib/game';
import { system, input } from '../../lib/impact';
import KeyCode from '../../lib/key-code';
import Music from '../../lib/music';

// import fontPath from './media/fonts/fredoka-one.font.png';
import titleFontPath from './media/fonts/semplicità-ombra-extra-large.png';
const titleFont = new Font(titleFontPath);

import bodyFontPath from './media/fonts/semplicità-medium.png';
const bodyFont = new Font(bodyFontPath);

import musicPath from './media/music/Tornaire OST - Overworld BGM LOOP - Diwa de Leon.mp3';

import config from './levels/level-0';
import { once } from '../../lib/util';

export default class Tornaire extends Game {
  public readonly gravity = 800;
  public titleFont = titleFont;
  public bodyFont = bodyFont;
  protected clearColor = '#e7e7e7';
  protected cellSize = 70;

  private music = new Music();

  constructor() {
    super();

    this.music.add(musicPath);
    this.music.loop = true;

    once(document, 'click', () => {
      if (this.music.isPlaying) {
        return;
      }

      this.music.play();
    });

    input.bind(KeyCode.ArrowLeft, 'left');
    input.bind(KeyCode.ArrowRight, 'right');
    input.bind(KeyCode.ArrowUp, 'jump');

    this.loadLevel(config);
  }

  public update() {
    super.update();
  }

  public draw() {
    super.draw();

    const hw = system.width / 2;
    const hh = system.height / 2 - this.titleFont.height / 2;
    this.titleFont.print('tornaire', hw, hh, Align.Center);
    this.bodyFont.print(
      'WASD TO MOVE, L TO JUMP',
      hw,
      hh + this.titleFont.height / 2 + this.bodyFont.height * 3,
      Align.Center,
    );
    this.bodyFont.print(
      'CLICK ANYWHERE TO START',
      hw,
      hh + this.titleFont.height / 2 + this.bodyFont.height * 4,
      Align.Center,
    );
  }
}
