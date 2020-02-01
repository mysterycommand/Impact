import Font, { Align } from '../../lib/font';
import Game from '../../lib/game';
import { system, input } from '../../lib/impact';
import KeyCode from '../../lib/key-code';
import Music from '../../lib/music';

import fontPath from './media/fredoka-one.font.png';
const font = new Font(fontPath);

import musicPath from './media/music/Ambient Bongos.mp3';

import config from './levels/level-0';
import { on } from '../../lib/util';

export default class Tornaire extends Game {
  public readonly gravity = 800;
  public font = font;
  protected clearColor = '#e7e7e7';

  private music = new Music();

  constructor() {
    super();

    this.music.add(musicPath);
    this.music.loop = true;

    on(document, 'click', () => {
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

    const scale = 3;

    system.context.save();
    system.context.scale(scale, scale);
    const hw = system.width / (2 * scale);
    const hh = system.height / (2 * scale) - (this.font.height * scale) / 2;
    this.font.print('tornaire', hw, hh, Align.Center);
    system.context.restore();
  }
}
