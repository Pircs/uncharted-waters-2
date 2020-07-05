import Assets from '../assets';
import Data, { BuildingLocations, CollisionIndices } from './data';
import Pixi from '../pixi';

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
  tileTextureMap: any;
  graphics: Pixi.Graphics;
}

const map = <Map>{
  tilesize: 16,
  columns: 96,
  rows: 96,
  baseTexture: new Pixi.BaseTexture(Assets.portTilesets),
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

  map.tileTextureMap = [];

  for (let i1 = 0; i1 < 240; i1 += 1) {
    for (let i2 = 0; i2 < 10; i2 += 1) {
      if (!map.tileTextureMap[i1]) {
        map.tileTextureMap[i1] = [];
      }

      map.tileTextureMap[i1][i2] = new Pixi.Texture(map.baseTexture, new Pixi.Rectangle(i1 * 16, i2 * 16, 16, 16))
    }
  }

  map.graphics = new Pixi.Graphics();
};

const tiles = (x: number, y: number) => map.tilemap[y * map.columns + x];

const draw = (timeOfDay: string) => {
  if (!map.portId) {
    setup();
  }

  for (let x = 0; x < map.columns; x += 1) {
    for (let y = 0; y < map.rows; y += 1) {
      map.graphics.beginTextureFill({
        texture: map.tileTextureMap[tiles(x, y)][tilesetOffset(timeOfDay)],
      });

      map.graphics.drawRect(
        x * 16,
        y * 16,
        16,
        16,
      );

      map.graphics.endFill();
    }
  }

  return map.graphics;
};

const timesOfDay = ['dawn', 'day', 'dusk', 'night'];
const tilesetOffset = (timeOfDay: string) => map.tileset * timesOfDay.length + timesOfDay.indexOf(timeOfDay);

export { draw };
