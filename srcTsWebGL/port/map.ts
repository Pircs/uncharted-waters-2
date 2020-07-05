import * as Pixi from 'pixi.js';

import Assets from '../assets';
import Data, { BuildingLocations, CollisionIndices } from './data';

// TODO: find a better representation of times of day tiles

interface Map {
  tilesize: number;
  columns: number;
  rows: number;
  tilemap: number[];
  tileset: number;
  buildings: BuildingLocations;
  collisionIndices: CollisionIndices;
  portId: number;
  baseTexture: Pixi.BaseTexture;
  textureMap: Pixi.Texture[][];
  graphics: Pixi.Graphics;
}

const map = <Map>{
  tilesize: 16,
  columns: 96,
  rows: 96,
};

const setup = () => {
  const portId = 1;
  const port = Data.ports[portId];

  map.tilemap = Assets.portTilemaps.slice(
    (portId - 1) * map.columns * map.rows,
    portId * map.columns * map.rows,
  );

  map.tileset = port.tileset;
  map.buildings = port.buildings;
  map.collisionIndices = Data.tilesets[map.tileset].collisionIndices;

  map.baseTexture = new Pixi.BaseTexture(Assets.portTilesets, {
    scaleMode: Pixi.SCALE_MODES.NEAREST,
  }),

  map.textureMap = [];

  for (let i = 0; i < 240; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      if (!map.textureMap[i]) {
        map.textureMap[i] = [];
      }

      map.textureMap[i][j] = new Pixi.Texture(map.baseTexture, new Pixi.Rectangle(
        i * map.tilesize,
        j * map.tilesize,
        map.tilesize,
        map.tilesize
      ));
    }
  }

  map.graphics = new Pixi.Graphics();
};

const tiles = (x: number, y: number) => map.tilemap[y * map.columns + x];

const draw = (timeOfDay: string) => {
  if (!map.baseTexture) {
    setup();
  }

  for (let x = 0; x < map.columns; x += 1) {
    for (let y = 0; y < map.rows; y += 1) {
      map.graphics.beginTextureFill({
        texture: map.textureMap[tiles(x, y)][tilesetOffset(timeOfDay)],
      });

      map.graphics.drawRect(
        x * map.tilesize,
        y * map.tilesize,
        map.tilesize,
        map.tilesize,
      );

      map.graphics.endFill();
    }
  }

  return map.graphics;
};

const timesOfDay = ['dawn', 'day', 'dusk', 'night'];
const tilesetOffset = (timeOfDay: string) => map.tileset * timesOfDay.length + timesOfDay.indexOf(timeOfDay);

export default { draw };
