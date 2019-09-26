import Font from '../../lib/font';
import Game from '../../lib/game';
import { main } from '../../lib/impact';

import '../../main.css';

import fontPath from './media/fredoka-one.font.png';

const fontResource = new Font(fontPath);

class MyGame extends Game {
  protected clearColor = '#d0f4f7';

  public font = fontResource;
}

main('#canvas', MyGame, 60, 320, 240, 2);
