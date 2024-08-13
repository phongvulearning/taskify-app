import React, { Suspense } from "react";

import { Info } from "./_componets/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "./_componets/board-list";
import { checkSubscription } from "@/lib/subscription";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
};

export default OrganizationIdPage;
