import { Board } from "@prisma/client";
import BoardTilteForm from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  board: Board;
}

export const BoardNavbar = ({ board }: BoardNavbarProps) => {
  return (
    <div className="w-full bg-black/50 fixed h-14 z-[40] top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTilteForm board={board} />
      <div className="ml-auto">
        <BoardOptions id={board.id} />
      </div>
    </div>
  );
};
