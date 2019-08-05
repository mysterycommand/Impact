const cache: { [key: string]: {} } = {};

function onLoad(event: Event) {
  console.log({ event });
}

function onError(event: ErrorEvent) {
  console.log({ event });
}

export function load(path: string) {
  console.log({ path });
  if (cache[path]) {
    return cache[path];
  }

  const image = new Image();
  image.addEventListener('load', onLoad);
  image.addEventListener('error', onError);
  image.src = path;
}
