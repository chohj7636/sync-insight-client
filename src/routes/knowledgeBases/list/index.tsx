import PageHeader from '@/components/PageHeader';
import KnowledgeBaseList from '@/features/knowledgeBase/KnowledgeBaseList';

const KnowledgeBasesListPage = () => {
  return (
    <div className="w-full">
      <PageHeader title="지식베이스 목록" />
      <KnowledgeBaseList />
    </div>
  );
};

export default KnowledgeBasesListPage;
