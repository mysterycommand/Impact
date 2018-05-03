const ig = {
  system: null,
  input: null,
  soundManager: null,
  music: null,
  ready: false,
  resources: [],
};

export default function main(
  canvasId,
  gameClass,
  fps,
  width,
  height,
  scale,
  loaderClass,
) {
  // ig.system = new ig.System(canvasId, fps, width, height, scale || 1);
  // ig.input = new ig.Input();
  // ig.soundManager = new ig.SoundManager();
  // ig.music = new ig.Music();
  ig.ready = true;

  var loader = new loaderClass /*  || ig.Loader */(gameClass, ig.resources);
  loader.load();
}
