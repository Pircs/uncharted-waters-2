import Assets from '../assets';
import Data from './data';
import * as Pixi from 'pixi.js';

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

interface Map {
  tilesize: number;
  columns: number;
  rows: number;
  scale: number;
  tilemap: number[];
  tilesets: HTMLImageElement;
  tileset: number;
  buildings: any;
  collisionIndices: CollisionIndices;
  portId: number;
  renderer: Pixi.Renderer;
  tilesetTexture: any;
  tileTextureMap: any;
  stage: any;
}

interface CollisionIndices {
  right: number;
  left: number;
  either: number;
}

const map = <Map>{};

const setup = () => {
  map.tilesize = 16;
  map.columns = 96;
  map.rows = 96;
  map.scale = 2;

  const portId = 1;
  const port = Data.ports[portId];

  map.tilemap = Assets.portTilemaps.slice(
    (portId - 1) * map.columns * map.rows,
    portId * map.columns * map.rows,
  );

  map.tilesets = Assets.portTilesets;
  map.tileset = port.tileset;
  map.buildings = port.buildings;
  map.collisionIndices = Data.tilesets[map.tileset].collisionIndices;

  map.renderer = new Pixi.Renderer({
    width: (640 + 32) * 2,
    height: (400 + 16 + 32) * 2,
    view: document.querySelector<HTMLCanvasElement>('canvas') || new HTMLCanvasElement(),
  });

  map.tilesetTexture = new Pixi.BaseTexture(Assets.portTilesets);

  map.tileTextureMap = [];

  for (let i1 = 0; i1 < 240; i1 += 1) {
    for (let i2 = 0; i2 < 10; i2 += 1) {
      if (!map.tileTextureMap[i1]) {
        map.tileTextureMap[i1] = [];
      }

      map.tileTextureMap[i1][i2] = new Pixi.Texture(map.tilesetTexture, new Pixi.Rectangle(i1 * 16, i2 * 16, 16, 16))
    }
  }

  //document.body.appendChild(map.renderer.view);
};

const tiles = (x: number, y: number) => map.tilemap[y * map.columns + x];

const draw = (timeOfDay: string) => {
  if (!map.portId) {
    setup();
  }

  map.stage = new Pixi.Container();
  const graphics = new Pixi.Graphics();

  for (let x = 0; x < map.columns; x += 1) {
    for (let y = 0; y < map.rows; y += 1) {
      graphics.beginTextureFill({
        texture: map.tileTextureMap[tiles(x, y)][tilesetOffset(timeOfDay)],
      });

      graphics.drawRect(
        x * 16,
        y * 16,
        16,
        16,
      );

      graphics.endFill();
    }
  }

  map.stage.addChild(graphics);
  map.stage.scale.set(2, 2);

  map.stage.position.x = 0;
  map.stage.position.y = 0;

  map.stage.pivot.x = 0;
  map.stage.pivot.y = 0;

  map.renderer.render(map.stage);
};

let cOffset = 0;

const characters = () => {
  const charactersTexture: any = new Pixi.BaseTexture(Assets.portCharacters);

  const charactersTextureMap: any = [];

  for (let i1 = 0; i1 < 32; i1 += 1) {
    charactersTextureMap[i1] = new Pixi.Texture(charactersTexture, new Pixi.Rectangle(i1 * 32, 0, 32, 32))
  }

  const graphics = new Pixi.Graphics();

  const chars: any[] = [
    {
      x: 6,
      y: 5,
      offset: 4,
    },
    {
      x: 8,
      y: 8,
      offset: 21,
    },
    {
      x: 11,
      y: 3,
      offset: 28,
    },
  ];

  chars.forEach((char) => {
    graphics.beginTextureFill({
      texture: charactersTextureMap[char.offset],
    });

    graphics.drawRect(
      char.x * 32,
      char.y * 32,
      32,
      32,
    );

    graphics.endFill();
  });

  map.stage.addChild(graphics);
};

const update = (offset: number) => {


  map.stage.pivot.x = offset;
  map.stage.pivot.y = offset;
  map.renderer.render(map.stage);
};

const timesOfDay = ['dawn', 'day', 'dusk', 'night'];
const tilesetOffset = (timeOfDay: string) => map.tileset * timesOfDay.length + timesOfDay.indexOf(timeOfDay);

export { setup, draw, update, characters };
