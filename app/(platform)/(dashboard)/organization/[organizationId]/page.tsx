import React, { Suspense } from "react";

import { Info } from "./_componets/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "./_componets/board-list";

const OrganizationIdPage = () => {
  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
};

export default OrganizationIdPage;
