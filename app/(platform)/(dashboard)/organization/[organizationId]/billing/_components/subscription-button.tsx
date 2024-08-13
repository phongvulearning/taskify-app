"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModalStore } from "@/hooks/use-pro-modal";
import { toast } from "sonner";

export const SubscriptionButton = ({ isPro }: { isPro: boolean }) => {
  const { onOpen } = useProModalStore();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      window.location.href = data;
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      onOpen();
    }
  };

  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isPro ? "Manage subscription" : "Upgrade to Pro"}
    </Button>
  );
};
