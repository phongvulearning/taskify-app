"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

import { Activity, CreditCard, Layout, Settings } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

interface NavItemProps {
  organization: Organization;
  isActive: boolean;
  isExpanded: boolean;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  organization,
  isActive,
  isExpanded,
  onExpand,
}: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    // {
    //   label: "Billing",
    //   icon: <CreditCard className="w-4 h-4 mr-2" />,
    //   href: `/organization/${organization.id}/billing`,
    // },
  ];

  const onClick = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          {
            "bg-sky-500/10 text-sky-700": isActive && !isExpanded,
          }
        )}
        onClick={() => onExpand(organization.id)}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="Organization"
              className="object-cover rounded-sm"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map(({ href, icon, label }) => (
          <Button
            variant="ghost"
            className={cn("w-full font-normal justify-start pl-10 mb-1", {
              "bg-sky-500/10 text-sky-700": pathname === href,
            })}
            size="sm"
            key={href}
            onClick={() => onClick(href)}
          >
            {icon} {label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="absolute w-full h-full" />
      </div>
      <Skeleton className="w-full h-10" />
    </div>
  );
};
