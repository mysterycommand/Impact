import Game from './game';
import Input from './input';
import Loader from './loader';
import System from './system';
import Sound from './sound';
import Music from './music';

export type LoadCallback = (path: string, success: boolean) => void;
export type Resource = {
  path: string;
  load: (callback?: LoadCallback) => void;
};

export const resources: Resource[] = [];

export let system: System;
export let input: Input;
export let ready = false;

export let sound: Sound;
export let music: Music;

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
  sound = new Sound();
  music = new Music();

  ready = true;
  const loader = new LoaderClass(GameClass, resources);
  loader.load();
}
