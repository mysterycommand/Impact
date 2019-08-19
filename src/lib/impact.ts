import Game from './game';
import Input from './input';
import Loader from './loader';
import System from './system';

export type Resource = {
  path: string;
};

export const resources: Resource[] = [];

export let system: System;
export let input: Input;
export let ready = false;

export function main(
  canvasId: string,
  GameClass: typeof Game,
  fps: number,
  width: number,
  height: number,
  scale: number = 1,
  LoaderClass: typeof Loader = Loader,
) {
  system = new System(canvasId, fps, width, height, scale);
  input = new Input();

  // ig.soundManager = new ig.SoundManager();
  // ig.music = new ig.Music();

  ready = true;

  const loader = new LoaderClass(GameClass, resources);
  loader.load();
}
