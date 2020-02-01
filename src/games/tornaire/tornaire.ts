import Bitmap from '../../lib/bitmap';
import Font, { Align } from '../../lib/font';
import Game from '../../lib/game';
import { system } from '../../lib/impact';

import tilePath from './media/tiles-70.png';
import fontPath from './media/fredoka-one.font.png';

new Bitmap(tilePath);
const font = new Font(fontPath);

export default class Tornaire extends Game {
  public readonly gravity = 800;
  public font = font;
  protected clearColor = '#e7e7e7';

  constructor() {
    super();
    this.loadLevel({
      entities: [],
      layers: [
        {
          name: 'background',
          width: 16,
          height: 14,
          linkWithCollision: false,
          visible: true,
          tileSetName: tilePath,
          repeat: true,
          preRender: false,
          distance: 2,
          tileSize: 70,
          foreground: false,
          // prettier-ignore
          data: [
            [0, 0, 0, 0, 0, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 27, 28, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ]
        },
        {
          name: 'main',
          width: 16,
          height: 14,
          linkWithCollision: false,
          visible: true,
          tileSetName: tilePath,
          repeat: false,
          preRender: false,
          distance: 1,
          tileSize: 70,
          foreground: false,
          // prettier-ignore
          data: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 135, 120, 120, 120, 120, 120, 120, 107, 0, 0, 0, 0],
            [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120],
          ]
        },
      ],
    });
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
