import DirManager from '@/features/directory/dirManager';
import PageHeader from '@/shared/components/PageHeader';

const DirectoryManagerPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="디렉토리 관리" />
      <DirManager />
    </div>
  );
};

export default DirectoryManagerPage;
