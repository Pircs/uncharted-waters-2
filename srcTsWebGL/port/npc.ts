let frame = 0;

export const npc = {
  characters: [
    {
      x: 8,
      y: 8,
      offset: 20,
      originalOffset: 20,
    },
    {
      x: 12,
      y: 12,
      offset: 24,
      originalOffset: 24,
    },
    {
      x: 12,
      y: 6,
      offset: 26,
      originalOffset: 26,
    },
    {
      x: 36,
      y: 36,
      offset: 2,
      originalOffset: 2,
    }
  ],
  update: () => {
    npc.characters.forEach((character) => {
      character.offset = character.originalOffset + frame;
    });

    if (!frame) {
      frame = 1;
    } else {
      frame = 0;
    }

    return npc.characters;
  }
};
