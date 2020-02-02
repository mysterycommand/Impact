import Entity, { Type } from '../../../lib/entity';
import SpriteSheet from '../../../lib/sprite-sheet';
import { random, floor, ceil, max, min } from '../../../lib/math';
import Sound from '../../../lib/sound';

import plant3Path from '../media/plant-3.png';
import plant4Path from '../media/plant-4.png';

import heal1Path from '../media/sounds/player/Heal1.mp3';
import heal2Path from '../media/sounds/player/Heal2.mp3';
import heal3Path from '../media/sounds/player/Heal3.mp3';
import heal4Path from '../media/sounds/player/Heal4.mp3';

const plant3SpriteSheet = new SpriteSheet(plant3Path, 70, 70);
const plant4SpriteSheet = new SpriteSheet(plant4Path, 70, 70);

const heal1Sound = new Sound(heal1Path);
const heal2Sound = new Sound(heal2Path);
const heal3Sound = new Sound(heal3Path);
const heal4Sound = new Sound(heal4Path);

import Player from './player';

export default class GoodPlant extends Entity {
  public size = { x: 70, y: 70 };
  private spriteSheets = [plant3SpriteSheet, plant4SpriteSheet];

  public checksAgainst = Type.Friend;

  private healSounds = [heal1Sound, heal2Sound, heal3Sound, heal4Sound];
  private get healSound() {
    return this.healSounds[floor(random() * this.healSounds.length)];
  }

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

  public check(other: Entity) {
    if (other instanceof Player) {
      other.receiveCoins(1);
      this.healSound.play();
      this.removeSelf();
    }
  }
}
