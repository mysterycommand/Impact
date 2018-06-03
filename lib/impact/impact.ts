import system from './system';
import input from './input';
import soundManager from './sound-manager';
import music from './music';
import loader from './loader';

export default function impact(canvas, main, { width, height, scale }) {
  system(canvas, width, height, scale);
  input();
  soundManager();
  music();
  loader(main);
}
