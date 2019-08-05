import './game.css';
import { useFont, Align } from './lib/font';

import path from './media/04b03.font.png';
import { getEl } from './lib/util';

const canvas = getEl('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

(async () => {
  const print = await useFont(path);
  print(
    ctx,
    `\
It works!
Multiline too!
`,
    canvas.width / 2,
    canvas.height / 2,
    Align.Center,
  );
})();
