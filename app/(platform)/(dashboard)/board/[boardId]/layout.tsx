import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return { title: "Board" };
  }

  const board = await db.board.findUnique({
    where: {
      orgId,
      id: params.boardId,
    },
  });

  return { title: `${board?.title}` };
}

export default async function BoardIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      orgId,
      id: params.boardId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full w-full bg-no-repeat bg-cover bg-center"
      // style={{ backgroundImage: `url(${board?.imageThumbUrl})` }}
    >
      <Image
        loading="eager"
        className="object-cover"
        src={board?.imageThumbUrl}
        alt={board?.title}
        fill
      />
      <Image
        loading="lazy"
        className="object-cover"
        src={board?.imageFullUrl}
        alt={board?.title}
        fill
      />
      <BoardNavbar board={board} />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
}
