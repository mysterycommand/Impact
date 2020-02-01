import Sound from './sound';
import { soundManager, system } from './impact';
import WebAudioSource from './web-audio-source';
import { on } from './util';
import { floor, random, min, max } from './math';
import Timer from './timer';

function map(
  pos: number,
  istart: number,
  istop: number,
  ostart: number,
  ostop: number,
) {
  return ostart + (ostop - ostart) * ((pos - istart) / (istop / istart));
}

export default class Music {
  public tracks: Sound[] = [];
  public namedTracks: { [name: string]: Sound } = {};

  public currentTrack?: Sound;
  public currentIndex = 0;
  public isRandom = false;

  private trackVolume = 1;
  private shouldLoop = false;

  private fadeInterval = 0;
  private fadeTimer?: Timer;
  private fadeStep = () => {
    if (!(this.currentTrack && this.fadeTimer)) {
      throw new Error(
        'Tried to `fadeStep` without a `currentTrack` or a `fadeTimer`',
      );
    }

    const delta = this.fadeTimer.delta();
    const v = min(max(0, map(delta, -delta, 0, 1, 0)), 1) * this.volume;

    if (v <= 0.01) {
      this.stop();
      this.currentTrack.volume = this.trackVolume;
      clearInterval(this.fadeInterval);
      return;
    }

    this.currentTrack.volume = v;
  };

  public get volume() {
    return this.trackVolume;
  }

  public set volume(value: number) {
    this.trackVolume = value;

    this.tracks.forEach(track => {
      track.volume = this.trackVolume;
    });
  }

  public get loop() {
    return this.shouldLoop;
  }

  public set loop(value: boolean) {
    this.shouldLoop = value;

    this.tracks.forEach(track => {
      track.loop = this.shouldLoop;
    });
  }

  // constructor() {}

  public add(soundOrPath: Sound | string, name?: string) {
    if (!Sound.enabled) {
      return;
    }

    const path = soundOrPath instanceof Sound ? soundOrPath.path : soundOrPath;
    const track = soundManager.load(path, false);

    if (track instanceof WebAudioSource) {
      system.stop();
      throw new Error(`Sound ${path} loaded multi-channel, but used for music`);
    }

    track.loop = this.shouldLoop;
    track.volume = this.trackVolume;

    on(track, 'ended', () => {
      if (this.shouldLoop) {
        this.play();
      } else {
        this.next();
      }
    });

    this.tracks.push(track);

    if (name) {
      this.namedTracks[name] = track;
    }

    if (!this.currentTrack) {
      this.currentTrack = track;
    }
  }

  public next() {
    if (!this.tracks.length) {
      return;
    }

    this.stop();
    this.currentIndex = this.isRandom
      ? floor(random() * this.tracks.length)
      : (this.currentIndex + 1) % this.tracks.length;
    this.currentTrack = this.tracks[this.currentIndex];
    this.play();
  }

  public pause() {
    if (!this.currentTrack) {
      return;
    }

    this.currentTrack.pause();
  }

  public stop() {
    if (!this.currentTrack) {
      return;
    }

    this.currentTrack.stop();
  }

  public play(name?: string) {
    if (name && this.namedTracks[name]) {
      const track = this.namedTracks[name];
      if (track !== this.currentTrack) {
        this.stop();
        this.currentTrack = track;
      }
    } else if (!this.currentTrack) {
      return;
    }

    this.currentTrack.play();
  }

  public fadeOut(time: number) {
    if (!this.currentTrack) {
      return;
    }

    window.clearInterval(this.fadeInterval);
    this.fadeTimer = new Timer(time);
    this.fadeInterval = setInterval(this.fadeStep, 50);
  }
}
