import { auth } from "@clerk/nextjs/server";

import { startCase } from "lodash";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "Organization"),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default OrganizationIdLayout;
