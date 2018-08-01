import * as buildings from './assets/data/buildings.json';
import * as ports from './assets/data/ports.json';
import * as portTilemaps from './assets/data/port-tilemaps.bin';

import * as characters from './assets/img/characters.png';
import * as tileset from './assets/img/port-tilesets.png';

const isObject = url => typeof url === 'object';
const isImage = url => url.substr(-4) === '.png';
const isBinary = url => url.substr(-4) === '.bin';

const toPromise = async (url, key) => {
  if (isImage(url)) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve({ [key]: img });
      img.onerror = reject;
    });
  }

  const response = await fetch(url);
  let data;

  if (isBinary(url)) {
    data = await response.arrayBuffer();
    data = new Uint8Array(data);
  } else {
    data = await response.json();
  }

  return { [key]: data };
};

const load = async (unloadedAssets) => {
  const promises = Object.keys(unloadedAssets).map(async (key) => {
    if (isObject(unloadedAssets[key])) {
      return {[key]: await load(unloadedAssets[key])};
    }

    return toPromise(unloadedAssets[key], key);
  });

  const loaded = await Promise.all(promises);
  return loaded.reduce((prev, curr) => Object.assign(prev, curr), {});
};

const assets = {};

export const loadAssets = async () => new Promise((resolve) => {
  const importBuildings = () => {
    const requireContext = require.context('./', true, /\/buildings\/[a-z-]+.png$/);
    const output = {};

    requireContext.keys().forEach((key) => {
      output[key.match(/([a-z-]+).png$/)[1]] = requireContext(key);
    });

    return output;
  };

  const importInterface = () => {
    const requireContext = require.context('./', true, /\/(interface|cursor)\/[a-z-]+.png$/);
    const output = {};

    requireContext.keys().forEach((key) => {
      output[key.match(/([a-z-]+).png$/)[1]] = requireContext(key);
    });

    return output;
  };

  load({
    buildings,
    ports,
    portTilemaps,
    characters,
    tileset,
    buildingAssets: {
      ...importBuildings(),
    },
    interfaceAssets: {
      ...importInterface(),
    },
  })
    .then((loadedAssets) => {
      Object.assign(assets, loadedAssets);
      resolve();
    });
});

export default assets;
