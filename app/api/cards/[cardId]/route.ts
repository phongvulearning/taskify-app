import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { orgId, userId } = auth();

    if (!orgId || !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cardId = params.cardId;

    const card = await db.card.findUnique({
      where: {
        id: cardId,
        lists: {
          board: {
            orgId,
          },
        },
      },
      include: {
        lists: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(card);
  } catch {
    return new Response("Interal Server Error", { status: 500 });
  }
}
