import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmbeddingInfo from '@/features/createKnowledgeBases/Embedding';
import KnowledgeBasesPreview from '@/features/createKnowledgeBases/KnowledgeBasesPreview';
import KnowledgeBasesInfo from '@/features/createKnowledgeBases/knowledgeBasesInfo';
import { createKnowledgeBaseApi } from '@/lib/api/knowledgeBases/api';
import PageHeader from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import useCreateKnowledgeBaseStore from '@/shared/hooks/useCreateKnowledgeBaseStore';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const MENULIST: {
  title: string;
  value: 'basic' | 'embedding' | 'checklist';
}[] = [
  {
    title: '1 지식베이스 기본 정보',
    value: 'basic',
  },
  {
    title: '2 임베딩 및 벡터화',
    value: 'embedding',
  },
  {
    title: '3 검토 및 생성',
    value: 'checklist',
  },
];

const KnowledgeBasesRegisterPage = () => {
  const navigate = useNavigate();
  // zustand data
  const {
    checkServiceName,
    dataSources,
    organInfo,
    knowledgeName,
    knowledgeDescription,
    splitter,
    embedderOptions,
    indexingOptions,
    breakPointType,
    breakPointAmount,
    chunkSize,
    chunkOverlap,
    recursiveLevel,
    textStandard,
    checkNotice,
    resetCreateKnowledgeBaseStore,
  } = useCreateKnowledgeBaseStore();

  // 지식베이스 생성 query
  const { mutate: createKnowledgeBase } = useMutation({
    mutationFn: createKnowledgeBaseApi,
    onSuccess: () => {
      toast('지식베이스 생성 성공', {
        duration: 2000,
        position: 'top-center',
      });
      resetCreateKnowledgeBaseStore(); // 생성 스토어값 초기화
      navigate('/knowledge-bases/list');
    },
    onError: () => {
      toast('지식베이스 생성 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // state
  const [subMenu, setSubMenu] = useState<'basic' | 'embedding' | 'checklist'>(
    'basic',
  );

  const submitCreateKnowledgeBase = () => {
    createKnowledgeBase({
      knowledgeName,
      organId: organInfo.organId,
      description: knowledgeDescription,

      splitter,
      splitterOptions:
        splitter === 'SEMANTIC'
          ? {
              breakPointType,
              breakPointAmount,
            }
          : splitter === 'RECURSIVE'
            ? {
                chunkSize,
                chunkOverlap,
                recursiveLevel,
              }
            : {
                chunkSize,
                chunkOverlap,
                textStandard,
              },
      embedder: embedderOptions.embedder,
      indexingOptions: {
        indexingType: indexingOptions.indexingType,
        indexingSchedule: indexingOptions.indexingSchedule,
      },
      dataSources: dataSources,
    });
  };

  const printFeatureArea = () => {
    switch (subMenu) {
      case 'basic':
        return <KnowledgeBasesInfo />;
      case 'embedding':
        return <EmbeddingInfo />;
      case 'checklist':
        return <KnowledgeBasesPreview />;
    }
  };

  // 페이지가 언마운트 되었을때
  useEffect(() => {
    return () => resetCreateKnowledgeBaseStore();
  }, [resetCreateKnowledgeBaseStore]);

  return (
    <div className="w-full">
      <PageHeader title="지식베이스 생성" />
      <div className="mb-7 flex items-center gap-2">
        {MENULIST.map((items) => {
          return (
            <div
              key={items.value}
              className={`${items.value === subMenu ? 'border-b-2 border-b-[#4C5667] font-bold' : 'font-medium text-[#667183]'} h-[32px] text-lg`}
            >
              <p className="">{items.title}</p>
            </div>
          );
        })}
      </div>

      {printFeatureArea()}

      <div
        id="button-wrap"
        className={`mt-7 flex w-full items-center ${
          subMenu === 'basic' ? 'justify-end' : 'justify-between'
        }`}
      >
        {subMenu !== 'basic' && (
          <Button
            className="h-[52px] w-[200px] rounded-[8px] border border-[#0066C3] px-9 text-[15px] font-bold text-[#0066C3]"
            onClick={() =>
              setSubMenu((prev) =>
                prev === 'embedding' ? 'basic' : 'embedding',
              )
            }
          >
            이전 단계로 이동
          </Button>
        )}
        <Button
          className={`h-[52px] w-[200px] rounded-[8px] px-9 text-[15px] font-bold ${
            subMenu === 'checklist'
              ? 'bg-[#0066C3] text-white'
              : 'border border-[#0066C3] text-[#0066C3]'
          }`}
          disabled={subMenu === 'checklist' && !checkNotice}
          onClick={() => {
            if (subMenu === 'checklist') {
              submitCreateKnowledgeBase();
            } else if (subMenu === 'basic') {
              if (!checkServiceName) {
                toast('서비스명을 확인해주세요.', {
                  duration: 2000,
                  position: 'top-center',
                });
                return;
              }
              setSubMenu((prev) =>
                prev === 'basic' ? 'embedding' : 'checklist',
              );
            } else
              setSubMenu((prev) =>
                prev === 'basic' ? 'embedding' : 'checklist',
              );
          }}
        >
          {subMenu === 'checklist' ? '완료' : '다음 단계로 이동'}
        </Button>
      </div>
    </div>
  );
};

export default KnowledgeBasesRegisterPage;
