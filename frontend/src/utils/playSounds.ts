// utils/sound.ts
export const playSound = (src: string) => {
  const sound = new Audio(src);
  sound.play();
};
