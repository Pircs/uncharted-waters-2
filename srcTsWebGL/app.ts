import { load } from './assets';
import { draw, update, characters } from './map';

load()
  .then(() => {
    let offset = 0;

    const loop = () => {
      update(offset);
      offset += 0;
      requestAnimationFrame(loop);
    };

    draw('dusk');
    characters();
    update(0);

    //requestAnimationFrame(loop);
  });
