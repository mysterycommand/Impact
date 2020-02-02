import Bitmap from '../../../lib/bitmap';
import { LevelConfig } from '../../../types';

import Coin from '../entities/coin';
import Hurt from '../entities/hurt';
import LevelChange from '../entities/levelchange';
import Player from '../entities/player';
import Trigger from '../entities/trigger';

import tilePath from '../media/tiles-70.png';
new Bitmap(tilePath);

const config: LevelConfig = {
  entities: [
    ...new Array(22).fill(null).reduce((acc, _, i) => {
      switch (i) {
        case 5:
        case 10:
        case 20:
          return acc;
        default:
          return acc.concat({ EntityClass: Coin, x: 87 + i * 70, y: 857 });
      }
    }, []),
    { EntityClass: Hurt, x: 615, y: 265, settings: { name: 'hurt' } },
    {
      EntityClass: Trigger,
      x: 490,
      y: 250,
      settings: { targets: ['hurt'], size: { x: 210, y: 30 }, wait: 0 },
    },
    {
      EntityClass: LevelChange,
      x: 1505,
      y: 855,
      settings: { name: 'exit' },
    },
    {
      EntityClass: Trigger,
      x: 1470,
      y: 800,
      settings: { targets: ['exit'], size: { x: 70, y: 110 }, wait: 0 },
    },
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
        [177,0,0,0,0,0,0,152,152,152,0,0,0,0,0,79,51,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,79,65,65,65,51,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,120,177],
        [177,121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,79,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,149,120,121,0,0,0,0,0,0,0,0,0,0,177],
        [177,0,0,0,0,0,0,0,0,0,0,177,0,0,0,0,93,0,0,0,0,80,0,177],
        [177,0,0,0,0,0,93,0,0,0,0,177,0,0,0,0,0,0,0,0,0,94,0,177],
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

export default config;
