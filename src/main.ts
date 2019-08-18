import { useFont, Align } from './lib/font';
import { useSystem } from './lib/system';

import path from './media/04b03.font.png';
import './main.css';

const { scale, canvas, context } = useSystem('#canvas', {
  fps: 60,
  scale: 2,
});

const { width, height } = canvas;

(async () => {
  const print = await useFont(path);

  print(
    context,
    `\
It works!
Multiline too!\
`,
    width / 2,
    height / 2,
    Align.Center,
    scale,
  );
})();
