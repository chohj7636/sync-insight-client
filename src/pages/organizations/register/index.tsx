import { RegisterOrganization } from '@/features/registerOrganization';
import PageHeader from '@/shared/components/PageHeader';

const OrganizationRegisterPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="회원사 신규 등록" />
      <RegisterOrganization />
    </div>
  );
};

export default OrganizationRegisterPage;
