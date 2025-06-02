import PageHeader from '@/components/PageHeader';
import { RegisterOrganization } from '@/features/registerOrganization';

const OrganizationRegisterPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="회원사 신규 등록" />
      <RegisterOrganization />
    </div>
  );
};

export default OrganizationRegisterPage;
