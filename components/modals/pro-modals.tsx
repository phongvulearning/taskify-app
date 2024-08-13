"use client";

import React from "react";
import { useProModalStore } from "../../hooks/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
  const { onClose, isOpen } = useProModalStore();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      window.location.href = data;
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0  overflow-hidden">
        <div className=" aspect-video relative flex items-center justify-center">
          <Image fill src="/hero.svg" alt="hero" className="object-cover" />
        </div>
        <div className=" text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Taskify Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of Taskify
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li className="text-neutral-600">Unlimited boards</li>
              <li className="text-neutral-600">Advanced checklists</li>
              <li className="text-neutral-600">Admin and security features</li>
              <li className="text-neutral-600">Access to all features</li>
            </ul>
          </div>
          <Button
            className="w-full"
            variant="default"
            onClick={onClick}
            disabled={isLoading}
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
