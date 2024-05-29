import { proxy } from "valtio";
import { Zod, z } from "./helper/zod";

export const BoardSchema = Zod.object("Board", {
  title: z.string(),
  isOpen: z.boolean(),
});

export type Board = z.infer<typeof BoardSchema>;

const boardFixture = Zod.parse(BoardSchema, {
  title: "title",
  isOpen: false,
});

export const createStore = () => {
  const board = proxy(boardFixture);
  return { board };
};

export const store = createStore();
