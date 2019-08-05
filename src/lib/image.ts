const cache: { [key: string]: HTMLImageElement } = {};

export function useImage(src: string): HTMLImageElement {
  if (cache[src]) {
    return cache[src];
  }

  const image = new Image();
  cache[src] = image;
  image.src = src;

  return image;
}
