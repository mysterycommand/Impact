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
          height: 9,
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
            [0,0,0,0,0,41,42,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,27,28,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,13,14,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,13,14,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,27,28,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          ]
        },
        {
          name: 'main',
          width: 24,
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
            [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,180,180,180,180,180,180,180,180,180,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,180,79,65,65,65,65,65,51,180,180,180,180,79,51,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,120,177],
            [177,121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,79,51,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,180,180,180,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,149,120,121,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,0,177,0,0,0,0,0,0,0,0,0,0,0,177],
            [177,0,0,0,0,0,0,0,0,0,0,177,180,0,0,0,0,0,0,0,0,0,0,177],
            [120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120]
          ]
        },
        {
          name: 'collision',
          width: 24,
          height: 14,
          linkWithCollision: false,
          visible: true,
          tileSetName: '',
          repeat: false,
          preRender: false,
          distance: 1,
          tileSize: 70,
          foreground: false,
          // prettier-ignore
          data: [
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,12,12,12,12,12,12,12,0,0,0,0,12,12,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,1],
            [1,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,12,12,12,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
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
