import * as Pixi from 'pixi.js';

import { npc } from './npc';
import Assets from '../assets';
import PercentNextMove from '../../src/port/percent-next-move';
import Input from './input';

const MAP_TILESIZE = 16;

interface Characters {
  tilesize: number;
  columns: number;
  rows: number;
  baseTexture: Pixi.BaseTexture;
  textureMap: Pixi.Texture[];
  graphics: Pixi.Graphics;
}

const characters = <Characters>{
  tilesize: 32,
  columns: 32,
  rows: 1,
  graphics: new Pixi.Graphics(),
};

const setup = () => {
  characters.baseTexture = new Pixi.BaseTexture(Assets.portCharacters, {
    scaleMode: Pixi.SCALE_MODES.NEAREST,
  });

  characters.textureMap = [];

  for (let i = 0; i < characters.columns; i += 1) {
    characters.textureMap[i] = new Pixi.Texture(characters.baseTexture, new Pixi.Rectangle(
      i * characters.tilesize,
      0,
      characters.tilesize,
      characters.tilesize
    ));
  }
};

const draw = () => {
  if (!characters.baseTexture) {
    setup();
  }

  PercentNextMove.update();
  if (PercentNextMove.percentNextMove !== 0) {
    return characters.graphics;
  }

  console.log(Input.direction);

  const npcs = npc.update();

  characters.graphics.clear();

  npcs.forEach((char) => {
    characters.graphics.beginTextureFill({
      texture: characters.textureMap[char.offset],
    });

    characters.graphics.drawRect(
      char.x * MAP_TILESIZE,
      char.y * MAP_TILESIZE,
      characters.tilesize,
      characters.tilesize,
    );

    characters.graphics.endFill();
  });

  return characters.graphics;
}

export default { draw };
