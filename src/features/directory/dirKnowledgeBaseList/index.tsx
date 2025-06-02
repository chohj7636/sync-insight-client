import { useNavigate } from 'react-router-dom';

import { knowledgeBaseListInDirApi } from '@/lib/api/datasource/api';
import { deleteDataSourceApi } from '@/lib/api/knowledgeBases/api';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/ui/loadingSpinner';
import useModal from '@/shared/hooks/useModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DirKnowledgeBaseListProps {
  dirId: string;
}

const DirKnowledgeBaseList = ({ dirId }: DirKnowledgeBaseListProps) => {
  const navigate = useNavigate();
  const { modal, modalClose } = useModal();

  // 지식베이스 query
  const {
    data: knowledgeBaseList,
    isLoading,
    refetch: refetchKnowledgeBaseList,
  } = useQuery({
    queryKey: ['knowledgeBaseList'],
    queryFn: () => knowledgeBaseListInDirApi({ dirId: dirId }),
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 지식베이스 연계 해제 query
  const { mutate: deleteKnowledgeBase } = useMutation({
    mutationFn: deleteDataSourceApi,
    onSuccess: () => {
      refetchKnowledgeBaseList();
      toast.success('지식베이스 연계 해제에 성공했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      modalClose();
    },
    onError: () => {
      toast.error('지식베이스 연계 해제에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      modalClose();
    },
  });

  // 파일 목록 테이블 헤더
  const HEADERLIST = [
    {
      label: '지식베이스명',
      key: 'knowledgeName',
    },
    {
      label: '지식베이스 생성일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      label: '태그',
      key: 'dataSourceTags',
    },
    { label: '생성자', key: 'createdBy' },
    {
      label: '관리',
      key: 'management',
      children: [
        {
          key: 'id',
          style: 'w-[90px]',
          render: (value: string) => (
            <Button
              className="mx-auto h-5 border border-[#E60020] px-2 text-sm text-[#E60020]"
              onClick={() => {
                modal({
                  title:
                    '지식베이스 연계 해제 시 벡터화된 DB도 모두 삭제됩니다.',
                  description:
                    '삭제된 후에는 복구하실 수 없습니다. 그래도 계속 하시겠습니까?',
                  status: 'info',
                  info: [
                    '- 연계된 지식베이스의 벡터화된 DB 정보가 모두 삭제됩니다.',
                    '- 동일 파일이라도 새로 등록할 경우 벡터 DB화에 비용이 발생합니다.',
                    '- 질의 시 삭제된 파일들은 검색 대상에서 영구 제외됩니다.',
                  ],
                  eventButton: {
                    title: '계속',
                    clickEvent: () => {
                      deleteKnowledgeBase({
                        dataSourceIds: [Number(value)],
                      });
                    },
                  },
                });
              }}
            >
              연계해제
            </Button>
          ),
        },
        {
          key: 'knowledgeBaseId',
          style: 'w-[90px]',
          render: (value: string) => (
            <Button
              className="mx-auto h-5 border border-[#0066C3] px-2 text-sm text-[#0066C3]"
              onClick={() => navigate(`/knowledge-bases/list/${value}`)}
            >
              상세보기
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5">
      <p className="text-xl font-bold text-[#27303F]">연계된 지식베이스</p>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <DefaultTable
          headerList={HEADERLIST}
          data={knowledgeBaseList?.payload ?? []}
        />
      )}
    </div>
  );
};

export default DirKnowledgeBaseList;
