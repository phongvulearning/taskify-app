"use client";

import { useCardModalStore } from "@/hooks/use-card-modal";
import React from "react";
import { Dialog, DialogContent } from "../../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";

export const CardModal = () => {
  const id = useCardModalStore((s) => s.id);
  const isOpen = useCardModalStore((s) => s.isOpen);
  const onClose = useCardModalStore((s) => s.onClose);

  const { data: card } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
  });

  const { data: auditLogs } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id,
  });

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        {!card ? <Header.Skeleton /> : <Header data={card} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!card ? <Description.Skeleton /> : <Description data={card} />}
              {!auditLogs ? (
                <Activity.Skeleton />
              ) : (
                <Activity data={auditLogs} />
              )}
            </div>
          </div>
          {!card ? <Actions.Skeleton /> : <Actions data={card} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
