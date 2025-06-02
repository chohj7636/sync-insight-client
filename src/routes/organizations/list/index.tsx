import PageHeader from "@/components/PageHeader";
import SearchOrganizations from "@/features/searchOrganizations";

const OrganizationsListPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="회원사 목록" />
      <SearchOrganizations />
    </div>
  );
};

export default OrganizationsListPage;
