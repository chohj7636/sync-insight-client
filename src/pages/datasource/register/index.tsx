import PageHeader from '@/components/PageHeader';
import RegisterDirectory from '@/features/directory/registerDirectory';

const DirectoryRegisterPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="디렉토리 생성" />
      <RegisterDirectory />
    </div>
  );
};

export default DirectoryRegisterPage;
