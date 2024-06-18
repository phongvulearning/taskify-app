import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

type Props = {
  data: AuditLog[];
};

export const Activity = ({ data }: Props) => {
  return (
    <div className="flex w-full gap-x-3 items-start">
      <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <ol className="mt-2 space-y-4">
          {data.map((log) => (
            <ActivityItem log={log} key={log.id} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = function SkeletonActivity() {
  return (
    <div className="flex w-full gap-x-3 items-start">
      <Skeleton className="w-6 h-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 mb-2 bg-neutral-200" />
      </div>
    </div>
  );
};
