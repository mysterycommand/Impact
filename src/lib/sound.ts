import {
  LoadCallback,
  ready,
  soundManager,
  resources,
  Resource,
} from './impact';

enum Format {
  Mp3 = 'Mp3',
  M4a = 'M4a',
  Ogg = 'Ogg',
  Webm = 'Webm',
  Caf = 'Caf',
}

export default class Sound implements Resource {
  public static readonly enabled = 'Audio' in window;
  public static readonly useWebAudio = 'AudioContext' in window;

  public static readonly formats = {
    [Format.Mp3]: { ext: 'mp3', mime: 'audio/mpeg' },
    [Format.M4a]: { ext: 'm4a', mime: 'audio/mp4; codecs=mp4a' },
    [Format.Ogg]: { ext: 'ogg', mime: 'audio/ogg; codecs=vorbis' },
    [Format.Webm]: { ext: 'webm', mime: 'audio/webm; codecs=vorbis' },
    [Format.Caf]: { ext: 'caf', mime: 'audio/x-caf' },
  };
  public static readonly use = [
    Sound.formats[Format.Ogg],
    Sound.formats[Format.Mp3],
  ];
  public static readonly channels = 4;

  public volume = 1;

  private currentClip?: any;
  private shouldLoop = false;

  public get loop() {
    return this.shouldLoop;
  }

  public set loop(value: boolean) {
    this.shouldLoop = value;

    if (this.currentClip) {
      this.currentClip.loop = this.shouldLoop;
    }
  }

  constructor(readonly path: string, readonly multiChannel = true) {
    this.load();
  }

  public load(callback?: LoadCallback) {
    if (!Sound.enabled) {
      callback && callback(this.path, true);
      return;
    }

    if (ready) {
      soundManager.load(this.path, this.multiChannel, callback);
    } else {
      resources.push(this);
    }
  }

  public play() {
    if (!Sound.enabled) {
      return;
    }

    this.currentClip = soundManager.get(this.path);
    this.currentClip.loop = this.shouldLoop;
    this.currentClip.volume = soundManager.volume * this.volume;
    this.currentClip.play();
  }

  public pause() {
    if (!this.currentClip) {
      return;
    }

    this.currentClip.pause();
  }

  public stop() {
    if (!this.currentClip) {
      return;
    }

    this.pause();
    this.currentClip.currentTime = 0;
  }
}
