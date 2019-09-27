import KeyCode from './key-code';
import { on } from './util';

type Bindings = {
  [code in KeyCode]?: string;
};

type Flags = {
  [key: string]: boolean;
};

export default class Input {
  private bindings: Bindings = {};
  private actions: Flags = {};
  private presses: Flags = {};
  private locks: Flags = {};
  private keyUps: Flags = {};

  private onKeyDown = (event: KeyboardEvent) => {
    const action = this.bindings[event.code as KeyCode];
    if (action) {
      this.actions[action] = true;

      if (!this.locks[action]) {
        this.presses[action] = true;
        this.locks[action] = true;
      }

      event.preventDefault();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    const action = this.bindings[event.code as KeyCode];
    if (action) {
      this.keyUps[action] = true;
      event.preventDefault();
    }
  };

  constructor() {
    on(window, 'keydown', this.onKeyDown);
    on(window, 'keyup', this.onKeyUp);
  }

  public bind(code: KeyCode, action: string) {
    this.bindings[code] = action;
  }

  public unbind(code: KeyCode) {
    const action = this.bindings[code]!;
    this.keyUps[action] = true;
    delete this.bindings[code];
  }

  public unbindAll() {
    this.bindings = {};
    this.actions = {};
    this.presses = {};
    this.locks = {};
    this.keyUps = {};
  }

  public state(action: string) {
    return this.actions[action];
  }

  public pressed(action: string) {
    return this.presses[action];
  }

  public released(action: string) {
    return this.keyUps[action];
  }

  public clearPressed() {
    for (const action in this.keyUps) {
      this.actions[action] = false;
      this.locks[action] = false;
    }

    this.presses = {};
    this.keyUps = {};
  }
}
