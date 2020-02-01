import { system, main } from '../../lib/impact';
import { query, on } from '../../lib/util';

import '../../main.css';

import Tornaire from './tornaire';

const { innerWidth: w, innerHeight: h } = window;
const canvasId = '#canvas';
const canvas = query(canvasId) as HTMLCanvasElement;

on(window, 'resize', ({ target }) => {
  const { innerWidth: w, innerHeight: h } = target as Window;

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  if (!system) {
    return;
  }

  system.resize(w, h);
});
window.dispatchEvent(new Event('resize'));

main(canvasId, Tornaire, 60, w, h, 1);
