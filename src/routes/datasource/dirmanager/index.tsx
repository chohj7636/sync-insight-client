import PageHeader from '@/components/PageHeader';
import DirManager from '@/features/directory/dirManager';

const DirectoryManagerPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="디렉토리 관리" />
      <DirManager />
    </div>
  );
};

export default DirectoryManagerPage;
