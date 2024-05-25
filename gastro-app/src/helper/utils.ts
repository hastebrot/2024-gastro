export const range = (start: number, end: number): number[] => {
  return [...Array(end - start).keys()].map((index) => start + index);
};

export const throwError = (message: string): never => {
  throw new Error(message);
};
