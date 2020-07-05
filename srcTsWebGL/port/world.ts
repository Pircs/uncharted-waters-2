import { draw } from './map';
import Pixi from '../pixi';

interface World {
  renderer: Pixi.Renderer;
  container: Pixi.Container;
}

const canvas = document.querySelector('canvas');

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
};

const setup = () => {
  const map = draw('day');

  Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

  world.container.addChild(map);
  world.container.scale.set(2, 2);

  setupi = 1;
};

let setupi = 0;

const update = (offset: number): void => {
  if (!setupi) {
    setup();
  }

  world.container.pivot.x = offset;
  world.container.pivot.y = offset;
  world.renderer.render(world.container);
};

export { update };
