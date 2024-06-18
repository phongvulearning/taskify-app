import { Suspense } from "react";
import { Info } from "../_componets/info";
import { Separator } from "@/components/ui/separator";
import { ActivityList } from "./_components/activity-list";

const ActivityPage = async () => {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
