import Entity, { Type } from '../../../lib/entity';
import SpriteSheet from '../../../lib/sprite-sheet';
import { random, floor, ceil, max, min } from '../../../lib/math';

import plant1Path from '../media/plant-1.png';
import plant2Path from '../media/plant-2.png';

const plant1SpriteSheet = new SpriteSheet(plant1Path, 70, 70);
const plant2SpriteSheet = new SpriteSheet(plant2Path, 70, 70);

export default class BadPlant extends Entity {
  public size = { x: 70, y: 70 };
  private spriteSheets = [plant1SpriteSheet, plant2SpriteSheet];

  public checksAgainst = Type.Friend;

  private age = 0;

  constructor(x: number, y: number) {
    super(x, y);

    this.spriteSheet = this.spriteSheets[
      floor(random() * this.spriteSheets.length)
    ];

    new Array(5).fill(null).forEach((_, i) => {
      this.addAnim(`${100 + i * 100}`, 1, [i], true);
    });
  }

  public update() {
    this.age += 1;
    this.currAnim = this.anims[
      `${min(max(100, ceil(this.age / 100) * 100), 500)}`
    ];
  }
}
