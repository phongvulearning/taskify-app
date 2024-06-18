"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { NavItem, Organization } from "./nav-item";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";

interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { organization: activceOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue = useMemo(() => {
    return Object.keys(expanded).reduce((acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    }, []);
  }, [expanded]);

  const onExpand = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        return {
          ...prev,
          [id]: !prev[id],
        };
      });
    },
    [setExpanded]
  );

  if (!isLoadedOrg || !isLoadedOrgList) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          className="ml-auto"
          type="button"
          variant="ghost"
          asChild
          size="icon"
        >
          <Link href={"/select-org"}>
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data?.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activceOrganization?.id === organization.id}
            organization={organization as Organization}
            onExpand={onExpand}
            isExpanded={expanded[organization.id]}
          />
        ))}
      </Accordion>
    </>
  );
};
