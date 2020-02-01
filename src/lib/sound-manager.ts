import { LoadCallback } from './impact';
import Sound from './sound';
import { once } from './util';
import WebAudioSource from './web-audio-source';

function isWebAudioSource(source: any): source is WebAudioSource {
  return source instanceof WebAudioSource;
}

export default class SoundManager {
  public clips: { [path: string]: WebAudioSource | HTMLAudioElement[] } = {};
  public volume = 1;
  public format?: { ext: string; mime: string };
  public audioContext: AudioContext;

  private unlockAudio = () => {
    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const source = this.audioContext.createBufferSource();

    if (!(buffer && source)) {
      throw new Error('Could not create audio source');
    }

    source.buffer = buffer;
    source?.connect(this.audioContext.destination);
    source?.start(0);
  };

  constructor() {
    // TODO: sanity check audio tag support?

    const probe = new Audio();
    this.format = Sound.use.find(({ mime }) => probe.canPlayType(mime));

    if (!this.format) {
      throw new Error('Cannot play any supported format');
    }

    this.audioContext = new AudioContext();
    once(document, 'touchstart', this.unlockAudio);
  }

  public load(path: string, multiChannel: boolean, callback?: LoadCallback) {
    return multiChannel && Sound.useWebAudio
      ? this.loadWebAudio(path, callback)
      : this.loadHtml5Audio(path, multiChannel, callback);
  }

  private loadWebAudio(path: string, callback?: LoadCallback) {
    if (this.clips[path] && this.clips[path] instanceof WebAudioSource) {
      return this.clips[path] as WebAudioSource;
    }

    const { audioContext } = this;

    const webAudioSource = new WebAudioSource();
    this.clips[path] = webAudioSource;

    fetch(path)
      .then(response => response.arrayBuffer())
      .then(
        arrayBuffer => {
          audioContext.decodeAudioData(
            arrayBuffer,
            buffer => {
              webAudioSource.buffer = buffer;
              callback && callback(path, true);
            },
            () => callback && callback(path, false),
          );
        },
        error => {
          console.error(error);
          callback && callback(path, false);
        },
      );

    return webAudioSource;
  }

  private loadHtml5Audio(
    path: string,
    multiChannel: boolean,
    callback?: LoadCallback,
  ) {
    if (this.clips[path]) {
      const clip = this.clips[path];

      if (isWebAudioSource(clip)) {
        return clip;
      }

      const channels = new Array().concat(clip);

      if (multiChannel && channels.length < Sound.channels) {
        for (let i = 0; i < Sound.channels; ++i) {
          const channel = new Audio(path);
          channel.load();
          channels.push(channel);
        }
      }

      return channels[0];
    }

    const clip = new Audio(path);
    if (callback) {
      // TODO: figure out if mobile browsers still 'stubbornly refuse to preload
      // HTML5' audio

      once(clip, 'canplaythrough', () => {
        callback(path, true);
      });

      once(clip, 'error', () => {
        callback(path, false);
      });
    }

    clip.preload = 'auto';
    clip.load();

    const channels = [clip];

    if (multiChannel) {
      for (let i = 0; i < Sound.channels; ++i) {
        const channel = new Audio(path);
        channel.load();
        channels.push(channel);
      }
    }

    this.clips[path] = channels;
    return clip;
  }

  public get(path: string) {
    const channels = this.clips[path];

    if (!channels) {
      throw new Error(`Couldn't find channels for path: ${path}`);
    }

    if (channels instanceof WebAudioSource) {
      return channels;
    }

    for (const clip of channels) {
      if (clip.paused || clip.ended) {
        if (clip.ended) {
          clip.currentTime = 0;
        }

        return clip;
      }
    }

    channels[0].pause();
    channels[0].currentTime = 0;
    return channels[0];
  }
}
