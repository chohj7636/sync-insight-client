import { useNavigate } from 'react-router-dom';

import { getServiceListByKnowledgeBaseApi } from '@/lib/api/knowledgeBases/api';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/ui/loadingSpinner';
import useCreateChatbotStore, {
  KnowledgeBaseInfoState,
} from '@/shared/hooks/useCreateChatbotStore';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface ConnectedServiceListProps {
  knowledgeBaseId: string;
  orgInfo: {
    orgId: string;
    orgName: string;
  };
  knowledgeBaseInfo: KnowledgeBaseInfoState;
}

const ConnectedServiceList = ({
  knowledgeBaseId,
  orgInfo,
  knowledgeBaseInfo,
}: ConnectedServiceListProps) => {
  const navigate = useNavigate();

  // zustnad state
  const { setOrganInfo, setKnowledgeBaseInfo } = useCreateChatbotStore();

  // 연결된 서비스 조회 query
  const { data: serviceListData, isLoading } = useQuery({
    queryKey: ['connectedServiceList'],
    queryFn: () => getServiceListByKnowledgeBaseApi({ knowledgeBaseId }),
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const HEADERLIST = [
    {
      label: '회원사명',
      key: 'orgName',
    },
    {
      label: '서비스명',
      key: 'chatBotName',
    },
    {
      label: '서비스 설명',
      key: 'description',
    },
    {
      label: '생성일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      label: '최근 수정일',
      key: 'updatedAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      label: '사용여부',
      key: 'isUsed',
      render: (value: string) => (value === 'Y' ? '이용중' : '이용중지'),
    },
    { label: '생성자', key: 'createdBy' },
    {
      label: '관리',
      key: 'id',
      render: (value: string) => (
        <Button
          className="h-5 border-[#0066C3] px-2 text-sm text-[#0066C3]"
          onClick={() => navigate(`/chatbot/list/${value}`)}
        >
          상세보기
        </Button>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full items-center justify-between">
        <p className="text-xl font-bold">연결된 서비스 목록</p>
        <Button
          className="h-7 bg-[#0066C3] px-2 text-sm text-white"
          onClick={() => {
            setOrganInfo({
              organId: orgInfo.orgId,
              organName: orgInfo.orgName,
            });
            setKnowledgeBaseInfo([
              {
                number: knowledgeBaseInfo.number,
                id: knowledgeBaseInfo.id,
                name: knowledgeBaseInfo.name,
                embeddingModel: knowledgeBaseInfo.embeddingModel,
                createdAt: knowledgeBaseInfo.createdAt,
                createdBy: knowledgeBaseInfo.createdBy,
              },
            ]);
            navigate('/chatbot/register');
          }}
        >
          + 연계 서비스 생성
        </Button>
      </div>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <DefaultTable
          headerList={HEADERLIST}
          data={serviceListData?.payload ?? []}
        />
      )}
    </div>
  );
};

export default ConnectedServiceList;
