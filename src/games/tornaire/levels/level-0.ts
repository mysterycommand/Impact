import Bitmap from '../../../lib/bitmap';
import { LevelConfig } from '../../../types';

import Coin from '../entities/coin';
import Player from '../entities/player';
import tilePath from '../media/tiles-70.png';
new Bitmap(tilePath);

export default <LevelConfig>{
  entities: [
    ...new Array(22)
      .fill(null)
      .map((_, i) => ({ EntityClass: Coin, x: 87 + i * 70, y: 857 })),
    { EntityClass: Player, x: 785, y: -70 },
  ],
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
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,79,51,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,79,65,65,65,51,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,120,177],
        [177,121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,79,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,149,120,121,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,177,0,0,0,0,93,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,93,0,0,0,0,177,0,0,0,0,0,0,0,0,0,0,0,177],
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
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,12,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,1],
        [1,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,12,12,12,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
  ],
};
