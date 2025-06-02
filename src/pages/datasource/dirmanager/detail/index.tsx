import { useParams } from 'react-router-dom';

import DirectoryFileList from '@/features/directory/dirFileList';
import DirKnowledgeBaseList from '@/features/directory/dirKnowledgeBaseList';
import DirectoryInfoPanel from '@/features/directory/directoryInfo';
import { getDirectoryDetail } from '@/lib/api/datasource/api';
import PageHeader from '@/shared/components/PageHeader';
import PageSkeleton from '@/shared/components/Skeleton/PageSkeleton';
import { useQuery } from '@tanstack/react-query';

const DirDetailPage = () => {
  const { dirId } = useParams<{ dirId: string }>();

  // query
  const { data, isLoading } = useQuery({
    queryKey: ['dirDetail', dirId],
    queryFn: () => getDirectoryDetail({ dirId: dirId ?? '' }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (data) {
    return (
      <div className="w-full">
        <PageHeader title={`디렉토리 | ${data.payload.dirName}`} />
        <DirectoryInfoPanel
          organId={data.payload.organId}
          organName={data.payload.organName}
          dirId={data.payload.dirId}
          dirName={data.payload.dirName}
          description={data.payload.description}
          categoryBreadcrumb={data.payload.categoryBreadcrumb}
          categoryId={data.payload.categoryId}
          creator={data.payload.createdBy}
          createdAt={data.payload.createdAt}
          updatedAt={data.payload.updatedAt}
          isOwnershipSecured={data.payload.isOwnershipSecured}
        />
        <div className="mt-10 flex w-full flex-col gap-10">
          {/* 연계된 지식 베이스 */}
          <DirKnowledgeBaseList dirId={dirId ?? ''} />

          {/* 디렉토리 파일 목록 */}
          <DirectoryFileList
            organId={data.payload.organId}
            dirId={dirId ?? ''}
          />
        </div>
      </div>
    );
  }

  return <div>데이터가 없습니다.</div>;
};

export default DirDetailPage;
