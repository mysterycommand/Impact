import Bitmap from '../../../lib/bitmap';
import { random } from '../../../lib/math';
import { LevelConfig } from '../../../types';

import BadPlant from '../entities/bad-plant';
import GoodPlant from '../entities/good-plant';
import Hurt from '../entities/hurt';
import LevelChange from '../entities/levelchange';
import Player from '../entities/player';
import Trigger from '../entities/trigger';

import tilePath from '../media/concrete-70.png';
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
          return random() < 0.3
            ? acc.concat({ EntityClass: GoodPlant, x: 70 + i * 70, y: 840 })
            : acc;
      }
    }, []),
    ...new Array(3).fill(null).map((_, i) => ({
      EntityClass: BadPlant,
      x: 490 + i * 70,
      y: 140,
    })),
    { EntityClass: Hurt, x: 595, y: 195, settings: { name: 'hurt' } },
    {
      EntityClass: Trigger,
      x: 490,
      y: 180,
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
				[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
				[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,11,0,8],
				[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,11,0,8],
				[8,0,0,0,0,0,1,3,2,3,1,0,0,0,0,0,0,0,0,0,0,0,0,8],
				[8,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,8],
				[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,120,8],
				[8,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,7,8,8],
				[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
				[8,7,0,0,0,79,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
				[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
				[8,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,8],
				[8,0,11,0,0,0,0,0,0,0,3,5,6,3,0,0,3,3,0,0,0,10,0,8],
				[8,0,0,0,0,0,4,0,0,0,0,5,0,0,0,0,0,0,0,0,0,9,0,8],
				[8,8,8,8,8,8,8,8,8,8,8,8,8,7,8,8,8,8,8,8,8,8,8,8]
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
				[1,0,0,0,0,0,12,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,12,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,12,12,0,0,0,0,0,1],
				[1,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ]
    },
  ],
};

export default config;
