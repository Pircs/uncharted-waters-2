import { load } from './assets';
import { update } from './port/world';

load()
  .then(() => {
    let offset = 0;

    const loop = () => {
      update(offset);
      offset += 1;
      requestAnimationFrame(loop);
    };

    update(0);

    requestAnimationFrame(loop);
  });
