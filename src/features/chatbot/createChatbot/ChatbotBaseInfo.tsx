import { useEffect, useState } from 'react';

import { checkChatbotNameAvailableApi } from '@/lib/api/chatbot/api';
import { CreateChatBotParams } from '@/lib/api/chatbot/type';
import { getKnowledgeBaseListApi } from '@/lib/api/knowledgeBases/api';
import DefaultSelect from '@/shared/components/DefaultSelect';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { DefaultPagination } from '@/shared/components/Pagination';
import RegisterCardLayout from '@/shared/components/RegisterCardLayout';
import TableModal, { ModalTable } from '@/shared/components/TableModal';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import useCreateChatbotStore, {
  KnowledgeBaseInfoState,
  RETENTION_PERIOD_LIST,
} from '@/shared/hooks/useCreateChatbotStore';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ChatbotBaseInfo = () => {
  // zustand state
  const {
    checkServiceName,
    setCheckServiceName,
    organInfo,
    setOrganInfo,
    chatBotName,
    setChatBotName,
    description,
    setDescription,
    chatLogRetentionPeriod,
    setChatLogRetentionPeriod,
    knowledgeBaseInfo,
    setKnowledgeBaseInfo,
  } = useCreateChatbotStore();

  // state
  const [openSearchOrganModal, setOpenSearchOrganModal] = useState(false);
  const [openSearchKnowledgeBaseModal, setOpenSearchKnowledgeBaseModal] =
    useState(false);

  // 유효성 검사 query
  const { data: chatbotNameAvailable, refetch } = useQuery({
    queryKey: ['chatbotNameAvailable'],
    queryFn: () =>
      checkChatbotNameAvailableApi({
        organId: organInfo.organId,
        chatBotName,
      }),
    enabled: false,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => data.payload,
  });

  // 유효성 검사에 따른 toast 출력 로직
  const handleDuplicateCheck = async () => {
    if (!chatBotName) {
      toast('서비스명을 입력해주세요.', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    const result = await refetch();
    const isAvailable = result.data;

    toast(
      isAvailable ? (
        '사용 가능한 서비스명입니다.'
      ) : (
        <>
          이미 등록된 이름입니다.
          <br />
          다른 이름을 입력해주세요.
        </>
      ),
      {
        duration: 2000,
        position: 'top-center',
      },
    );
  };

  const getSelectedKnowledgeBase = (data: KnowledgeBaseInfoState | null) => {
    if (data) {
      setKnowledgeBaseInfo([data]);
    }
    setOpenSearchKnowledgeBaseModal(false);
  };

  useEffect(() => {
    if (chatbotNameAvailable !== undefined) {
      setCheckServiceName(chatbotNameAvailable);
    }
  }, [setCheckServiceName, chatbotNameAvailable]);

  return (
    <div className="flex w-full flex-col gap-7">
      {openSearchOrganModal && (
        <TableModal
          type="organization"
          title="회원사 찾기"
          clickConfirm={(organId, organName) => {
            setOrganInfo({
              organId: organId,
              organName: organName,
            });
          }}
          closeModal={() => setOpenSearchOrganModal(false)}
        />
      )}
      <RegisterCardLayout title="서비스 기본 정보 설정">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">서비스 기본 설정</p>

          <div className="flex items-center gap-5 pb-5">
            <p className="w-[116px] text-[15px]">회원사 *</p>
            <div className="flex gap-2">
              <Input
                className="h-[36px] w-[388px] rounded-sm bg-white"
                disabled
                value={organInfo.organName}
              />
              <Button
                className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-[14px] font-normal text-white"
                onClick={() => setOpenSearchOrganModal(true)}
              >
                찾아보기
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">서비스명 *</p>
            <div className="flex gap-2">
              <Input
                className="h-[36px] w-[388px] rounded-sm bg-white"
                value={chatBotName}
                disabled={!organInfo.organId}
                onChange={(e) => setChatBotName(e.target.value)}
              />
              <Button
                className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-[14px] font-normal text-white"
                disabled={!organInfo.organId}
                onClick={handleDuplicateCheck}
              >
                중복확인
              </Button>
              {checkServiceName && (
                <div className="flex h-[36px] w-[80px] items-center justify-center rounded-sm bg-[#E4E7EB] text-[14px] text-[#3F4959]">
                  확인완료
                </div>
              )}
            </div>
          </div>

          <div className="w-full pl-[136px]">
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-[14px] text-[#98A2B2]">
              <p>- 사용자에게 보여지는 서비스명입니다.</p>
              <p>
                - 고유한 서비스명을 입력해주세요. (ex. 고객상담봇, 연구지원봇
                ...)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">서비스 설명</p>
            <Textarea
              className="h-[56px] w-[874px] rounded-sm bg-white placeholder:text-[#98A2B2]"
              placeholder="서비스의 주요 기능과 용도를 입력해주세요.(ex. 연구 및 학술자료 기반의 정확한 답변 제공, 채용 가이드 기반의 정확한 채용정보 답변 제공 등)"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </RegisterCardLayout>

      <RegisterCardLayout title="데이터 저장 설정">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">대화 로그 저장 설정</p>
          <div className="flex items-center gap-5">
            <p className="text-[15px] font-medium">대화 로그 저장</p>
            <DefaultSelect
              className="h-[36px] w-[180px] rounded-sm bg-white"
              selectList={RETENTION_PERIOD_LIST}
              defaultValue={chatLogRetentionPeriod}
              setValue={(value) =>
                setChatLogRetentionPeriod(
                  value as CreateChatBotParams['chatLogRetentionPeriod'],
                )
              }
            />
          </div>
        </div>
      </RegisterCardLayout>

      <RegisterCardLayout title="지식베이스 선택">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">지식베이스 불러오기</p>

          <div className="flex items-center gap-4">
            <p className="w-[116px] text-[15px] font-medium">지식베이스 검색</p>
            <div id="button-wrap" className="flex items-center gap-1">
              <Button
                className="h-[28px] bg-[#667183] px-3 text-[14px] font-normal text-white"
                onClick={() => {
                  if (organInfo.organId) {
                    setOpenSearchKnowledgeBaseModal(true);
                  } else {
                    toast('회원사를 선택해주세요.', {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }
                }}
              >
                + 지식베이스 선택
              </Button>
              <p className="text-[14px] text-[#4C5667]">
                건너뛰기 후 다음에 선택하실 수 있습니다. 지식베이스는 하나만
                연결할 수 있습니다.
              </p>
            </div>
          </div>

          <p className="text-lg font-bold">선택된 지식베이스</p>

          {/* 테이블 영역 */}
          <DefaultTable
            headerList={[
              { label: '지식베이스명', key: 'name' },
              {
                label: '임베딩모델',
                key: 'embeddingModel',
              },
              {
                label: '생성일',
                key: 'createdAt',
                render: (value: string) =>
                  format(new Date(value), 'yyyy-MM-dd'),
              },
              { label: '생성자', key: 'createdBy' },
              {
                label: '관리',
                key: 'embeddingModel',
                render: () => (
                  <Button
                    className="h-[20px] rounded-sm border border-[#E60020] px-2 text-[14px] font-normal text-[#E60020]"
                    onClick={() => setKnowledgeBaseInfo([])}
                  >
                    <p className="text-sm text-[#E60020]">연계해제</p>
                  </Button>
                ),
              },
            ]}
            data={knowledgeBaseInfo}
          />
        </div>
      </RegisterCardLayout>

      {openSearchKnowledgeBaseModal && (
        <SearchKnowledgeBaseModal
          title="지식베이스 찾기"
          organName={organInfo.organName}
          closeModal={() => setOpenSearchKnowledgeBaseModal(false)}
          clickConfirmButton={getSelectedKnowledgeBase}
        />
      )}
    </div>
  );
};

export default ChatbotBaseInfo;

interface KnowledgeBaseProps {
  title: string;
  organName: string;
  closeModal: () => void;
  clickConfirmButton: (data: KnowledgeBaseInfoState | null) => void;
}

export const SearchKnowledgeBaseModal = ({
  title,
  organName,
  closeModal,
  clickConfirmButton,
}: KnowledgeBaseProps) => {
  // state
  const [knowledgeBaseName, setKnowledgeBaseName] = useState<
    string | undefined
  >();
  const [page, setPage] = useState(0);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    useState<KnowledgeBaseInfoState | null>(null);

  // 지식베이스 목록 조회 query
  const { data: knowledgeBaseList, refetch } = useQuery({
    queryKey: ['knowledgeBaseList-Modal'],
    queryFn: () =>
      getKnowledgeBaseListApi({
        knowledgeName: knowledgeBaseName,
        organName,
        // page,
        size: 10,
      }),
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const clickTableRow = (dataItem: KnowledgeBaseInfoState) => {
    setSelectedKnowledgeBase(dataItem);
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => clickConfirmButton(selectedKnowledgeBase)}
    >
      <p className="text-2xl font-bold">{title}</p>
      <div className="mt-6 mb-12 flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <p className="text-[15px] font-medium">선택된 지식베이스</p>
          <div className="flex h-[52px] w-full flex-wrap items-center gap-[10px] overflow-y-auto rounded-md border border-[#D0D5DD] p-3">
            {selectedKnowledgeBase && (
              <div className="gap-2 rounded-sm bg-[#27303F] px-3 py-1 text-[14px] text-white">
                <p>{selectedKnowledgeBase.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-2">
            <div className="flex h-9 w-[120px] items-center rounded-sm border border-[#D0D5DD] px-2 text-[15px]">
              지식베이스명
            </div>
            <Input
              className="flex-1"
              value={knowledgeBaseName}
              onChange={(e) => setKnowledgeBaseName(e.target.value)}
            />
            <Button
              className="h-9 w-[80px] rounded-sm bg-[#667183] text-white"
              onClick={() => refetch()}
            >
              검색
            </Button>
          </div>

          <ModalTable
            data={
              knowledgeBaseList?.payload.content.map((element, index) => ({
                number: index + 1,
                id: element.id,
                name: element.knowledgeName,
                embeddingModel: element.embedderConfig.model,
                createdAt: element.createdAt,
                createdBy: element.createdBy,
              })) ?? []
            }
            headerList={[
              { label: '선택', key: 'number' },
              { label: '지식베이스명', key: 'name' },
              {
                label: '임베딩모델',
                key: 'embeddingModel',
                render: (value: string) => (
                  <div className="flex items-center justify-center">
                    <p className="max-w-[100px] text-wrap">{value}</p>
                  </div>
                ),
              },
              {
                label: '생성일',
                key: 'createdAt',
                render: (value: string) =>
                  format(new Date(value), 'yyyy-MM-dd'),
              },
              { label: '생성자', key: 'createdBy' },
            ]}
            onclickTableRow={(dataItem) =>
              clickTableRow(dataItem as KnowledgeBaseInfoState)
            }
          />
          <DefaultPagination
            totalPages={knowledgeBaseList?.payload.totalPages ?? 0}
            currentPage={page + 1}
            setCurrentPage={(prevPage) => {
              setPage(prevPage - 1);
            }}
          />
        </div>
      </div>
    </ModalLayout>
  );
};
