import portTilesets from './port/assets/tilesets.png';
import portTilemaps from './port/assets/tilemaps.bin';
import portCharacters from './port/assets/characters.png';
import portCursors from './port/assets/cursors.png';

export interface Assets {
  [key: string]: any;
}

// if initialized with the interface, autocomplete will not be possible
const assets = {
  portTilesets,
  portTilemaps,
  portCharacters,
  portCursors,
};

const isImage = (url: string) => url.endsWith('.png');
const isBinary = (url: string) => url.endsWith('.bin');

const loadImage = (url: string) => new Promise<HTMLImageElement>((resolve) => {
  const img = new Image();
  img.src = url;

  img.onload = () => resolve(img);
});

const loadBinary = (url: string) => fetch(url)
  .then(response => response.arrayBuffer())
  .then(response => new Uint8Array(response));

// the goal is to only have to call load() one time
const load = async (a: Assets = assets) => {
  const promises: Promise<HTMLImageElement | Uint8Array>[] = [];

  Object.keys(a).forEach((key) => {
    if (isImage(a[key])) {
      promises.push(loadImage(a[key]));
    } else if (isBinary(a[key])) {
      promises.push(loadBinary(a[key]));
    }
  });

  const resolvedPromises = await Promise.all(promises);

  Object.keys(a).forEach((key) => {
    a[key] = resolvedPromises.shift()!;
  });
};

export default assets;
export { load };