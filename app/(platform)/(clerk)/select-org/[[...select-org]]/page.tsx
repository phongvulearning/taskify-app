import { OrganizationList } from "@clerk/nextjs";

export default function SelectOrgPage() {
  return (
    <OrganizationList
      hidePersonal={true}
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
  );
}
