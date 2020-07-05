import Assets from './assets';

interface Cursors {
  [key: string]: string;
}

const directions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

const cursors = <Cursors>{};
const tilesize = 24;
const scale = 2;

const camera = document.getElementById('camera') as HTMLCanvasElement;

const cursorCanvas = document.createElement('canvas');
const cursorContext = cursorCanvas.getContext('2d') as CanvasRenderingContext2D;
cursorCanvas.width = tilesize * scale;
cursorCanvas.height = tilesize * scale;
cursorContext.scale(scale, scale);
cursorContext.imageSmoothingEnabled = false;

export default {
  setup: () => {
    directions.forEach((direction, i) => {
      cursorContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
      cursorContext.drawImage(
        Assets.portCursors,
        i * tilesize,
        0,
        tilesize,
        tilesize,
        0,
        0,
        tilesize,
        tilesize
      );
      cursors[direction] = cursorCanvas.toDataURL();
    });
  },
  update: (directionOrIndex: number | string) => {
    let direction = directionOrIndex;

    if (typeof direction === 'number') {
      direction = directions[direction];
    }

    camera.style.cursor = `url(${cursors[direction]}) 24 24, auto`;
    return direction;
  },
  reset: () => {
    camera.style.removeProperty('cursor');
  },
  cursors,
};
