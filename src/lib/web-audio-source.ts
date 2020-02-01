import { soundManager } from './impact';
import { once } from './util';

export default class WebAudioSource {
  public readonly gain: GainNode;
  public buffer?: AudioBuffer;

  private shouldLoop = false;

  private sources: AudioBufferSourceNode[] = [];

  public get loop() {
    return this.shouldLoop;
  }

  public set loop(value: boolean) {
    this.shouldLoop = value;

    this.sources.forEach(source => {
      source.loop = this.shouldLoop;
    });
  }

  public get volume() {
    return this.gain.gain.value;
  }

  public set volume(value: number) {
    this.gain.gain.value = value;
  }

  constructor() {
    this.gain = soundManager.audioContext.createGain();
    this.gain.connect(soundManager.audioContext.destination);
  }

  public play() {
    if (!this.buffer) {
      return;
    }

    const source = soundManager.audioContext.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.gain);
    source.loop = this.shouldLoop;

    const i = this.sources.push(source);
    once(source, 'ended', () => {
      this.sources.splice(i, 1);
    });
    source.start();
  }

  public pause() {
    this.sources.forEach(source => {
      try {
        source.stop();
      } catch (error) {
        console.error(error);
      }
    });
  }
}
