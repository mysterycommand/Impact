import { useFont, Align } from './lib/font';

import path from './media/04b03.font.png';

import './game.css';
import { useSystem } from './lib/system';

const {
  canvas: { width, height },
  context,
} = useSystem('#canvas');

(async () => {
  const print = await useFont(path);
  print(
    context,
    `\
It works!
Multiline too!
`,
    width / 2,
    height / 2,
    Align.Center,
  );
})();
