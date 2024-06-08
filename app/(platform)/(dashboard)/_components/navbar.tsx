import { Plus } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center px-4">
      <div className="flex items-center gap-x-4">
        {/* <MobileSidebar /> */}
        <div className="hidden md:flex">
          <Logo />
        </div>
        {/* <FormPopover align="start" side="bottom" sideOffset={18}> */}
        <Button
          size="sm"
          className="rounded-sm hidden md:block h-auto py-1.5 px-2"
        >
          Create
        </Button>
        {/* </FormPopover> */}
        {/* <FormPopover sideOffset={10}> */}
        <Button className="rounded-sm block md:hidden" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
        {/* </FormPopover> */}
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterSelectOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: "30px",
                width: "30px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};
