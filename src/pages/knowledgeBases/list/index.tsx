import KnowledgeBaseList from '@/features/knowledgeBase/KnowledgeBaseList';
import PageHeader from '@/shared/components/PageHeader';

const KnowledgeBasesListPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="지식베이스 목록" />
      <KnowledgeBaseList />
    </div>
  );
};

export default KnowledgeBasesListPage;
