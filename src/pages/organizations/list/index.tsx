import SearchOrganizations from '@/features/searchOrganizations';
import PageHeader from '@/shared/components/PageHeader';

const OrganizationsListPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="회원사 목록" />
      <SearchOrganizations />
    </div>
  );
};

export default OrganizationsListPage;
