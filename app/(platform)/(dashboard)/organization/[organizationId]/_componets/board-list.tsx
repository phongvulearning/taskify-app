import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { HelpCircle, User2 } from "lucide-react";

import { db } from "@/lib/db";
import { redirectAuth } from "@/lib/redirect";

import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { redirect } from "next/navigation";
import { getCountAvailable } from "@/lib/org-limit";
import { MAX_FREE_BOARDS } from "@/constants/board";
import { checkSubscription } from "@/lib/subscription";

export const BoardList = async () => {
  const { orgId } = auth();
  redirectAuth();

  if (!orgId) {
    redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
  });

  const availableCount = await getCountAvailable();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="w-6 h-6 mr-2" /> Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            style={{
              backgroundImage: `url(${board.imageFullUrl})`,
            }}
            className="group relative aspect-video w-full h-full bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm p-2 overflow-hidden"
          >
            <div className="absolute bg-black/30  inset-0 transition group-hover:bg-black/40" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        <FormPopover side="right" sideOffset={10}>
          <div
            className="relative aspect-video h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            role="button"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {isPro
                ? "Unlimited"
                : `${Math.max(MAX_FREE_BOARDS - availableCount, 0)} remaining`}
            </span>
            <Hint
              sideOffset={10}
              side="bottom"
              align="start"
              description={
                isPro
                  ? `Unlimited workspaces can have up to ${availableCount} boards.`
                  : `
            Free workspaces can have up to ${availableCount} boards. For unlimited boards, upgrade to a paid plan.  
           `
              }
            >
              <HelpCircle className="absolute bottom-2 right-2 w-[14px] h-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletenBoardList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <Skeleton className="w-6 h-6 mr-2" />
        <Skeleton className="w-32 h-6" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="aspect-video w-full h-full p-2" />
        ))}
      </div>
    </div>
  );
};
