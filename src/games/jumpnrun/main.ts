import Bitmap from '../../lib/bitmap';
import Font, { Align } from '../../lib/font';
import Game from '../../lib/game';
import { input, main, system } from '../../lib/impact';
import KeyCode from '../../lib/key-code';
import SpriteSheet from '../../lib/sprite-sheet';
import { query, on } from '../../lib/util';
import Camera from '../../plugins/camera';

import '../../main.css';

import Player from './entities/player';
import { config as titleConfig } from './levels/title';
import { config as grasslandsConfig } from './levels/grasslands';

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
const coinIconResource = new SpriteSheet(coinIconPath, 36, 36);
const titleResource = new Bitmap(titlePath);

class MyGame extends Game {
  public readonly gravity: number = 800;

  protected clearColor = '#d0f4f7';

  public font = fontResource;

  public heartFull = heartFullResource;
  public heartEmpty = heartEmptyResource;
  public coinIcon = coinIconResource;

  private camera = new Camera(system.width / 3, system.height / 3, 3);

  constructor() {
    super();

    this.font.letterSpacing = -2;
    this.loadLevel(grasslandsConfig);

    this.setupCamera();
  }

  public update() {
    super.update();
    this.camera.follow(this.namedEntites['player']);
  }

  public draw() {
    super.draw();

    const { player } = this.namedEntites;
    if (player && player instanceof Player) {
      let x = 16;
      const y = 16;

      for (let i = 0; i < player.maxHealth; ++i) {
        (player.health > i ? this.heartFull : this.heartEmpty).draw(
          0,
          0,
          this.heartEmpty.width,
          this.heartEmpty.height,
          x,
          y,
        );
        x += this.heartEmpty.width + 8;
      }

      x += 48;
      this.coinIcon.draw(0, x, y + 6);

      x += 42;
      this.font.print(`x ${player.coins}`, x, y + 10);
    }

    // TODO: touch buttons!?
  }

  private setupCamera() {
    this.camera.trap.size.x = system.width / 10;
    this.camera.trap.size.y = system.height / 3;
    this.camera.lookAhead.x = system.width / 6;
    this.camera.max.x = this.collisionMap.pixelWidth - system.width;
    this.camera.max.y = this.collisionMap.pixelHeight - system.height;
    this.camera.set(this.namedEntites['player']);
  }
}

class MyTitle extends Game {
  public readonly gravity: number = 800;

  protected clearColor = '#d0f4f7';

  public font = fontResource;

  public title = titleResource;

  private maxY = 0;

  constructor() {
    super();

    this.font.letterSpacing = -2;

    input.bind(KeyCode.ArrowLeft, 'left');
    input.bind(KeyCode.ArrowRight, 'right');
    input.bind(KeyCode.KeyX, 'jump');
    input.bind(KeyCode.KeyC, 'shoot');

    this.loadLevel(titleConfig);

    this.maxY = this.sceneryMaps[0].pixelHeight - system.height;
  }

  public update() {
    if (input.pressed('jump') || input.pressed('shoot')) {
      system.setGame(MyGame);
      return;
    }

    super.update();

    const move = this.maxY - this.screen.y;
    if (move > 5) {
      this.screen.y += move * system.tick;
    }
    this.screen.x = (this.sceneryMaps[0].pixelWidth - system.width) / 2;
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
