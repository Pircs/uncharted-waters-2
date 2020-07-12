import * as Pixi from 'pixi.js';

import Map from './map';
import Characters from './characters';
import Input from './input';

interface World {
  renderer: Pixi.Renderer;
  container: Pixi.Container;
  setup: boolean;
}

const canvas = document.getElementById('camera') as HTMLCanvasElement;

if (!canvas) {
  throw 'No canvas to render World!';
}

const world = <World>{
  container: new Pixi.Container(),
  renderer: new Pixi.Renderer({
    width: (640 + 32) * 2,
    height: (400 + 16 + 32) * 2,
    view: canvas,
  }),
  setup: false,
};

const setup = () => {
  Input.setup();
  const map = Map.draw('day');
  const characters = Characters.draw();

  world.container.addChild(map);
  world.container.addChild(characters);
  world.container.scale.set(2, 2);

  world.setup = true;
};

const update = (offset: number): void => {
  if (!world.setup) {
    setup();
  }

  Characters.draw();

  world.container.pivot.x = offset;
  world.container.pivot.y = offset;
  world.renderer.render(world.container);
};

export { update };
