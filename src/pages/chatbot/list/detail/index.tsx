import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ConfigCardLayout from '@/components/ConfigCardLayout';
import { DefaultTable } from '@/components/DefaultTable';
import ModalLayout from '@/components/ModalLayout';
import PageHeader from '@/components/PageHeader';
import PageSkeleton from '@/components/Skeleton/PageSkeleton';
import ChatBot from '@/features/chatbot/ChatBot';
import ReferListCard from '@/features/chatbot/ReferListCard';
import { SearchKnowledgeBaseModal } from '@/features/chatbot/createChatbot/ChatbotBaseInfo';
import ChatBotUpdateConfigWrap from '@/features/chatbot/detailChatbot/ChatBotUpdateConfigWrap';
import {
  checkChatbotNameAvailableApi,
  deleteChatBotKnowledgeBaseApi,
  getAgentChatApi,
  getChatBotDetailApi,
  previewChatBotPromptApi,
  updateChatBotKnowledgeBaseApi,
  updateChatBotMessageConfigApi,
  updateChatBotServiceInfoApi,
  updateChatBotStatusApi,
} from '@/lib/api/chatbot/api';
import {
  DeleteChatBotKnowledgeBaseParams,
  PreviewChatBotPromptParams,
  ReferenceFileList,
  UpdateChatBotKnowledgeBaseParams,
  UpdateChatBotMessageConfigParams,
  UpdateChatBotServiceInfoParams,
  UpdateChatBotStatusParams,
} from '@/lib/api/chatbot/type';
import { KnowledgeBaseInfoState } from '@/shared/hooks/useCreateChatbotStore';
import IconSetting from '@/shared/icons/icon-setting.svg';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { LoadingSpinner } from '@/shared/ui/loadingSpinner';
import { Textarea } from '@/shared/ui/textarea';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ChatBotServiceDetailPage = () => {
  const { chatbotId } = useParams<{ chatbotId: string }>();

  // state
  const [openChatPreviewModal, setOpenChatPreviewModal] = useState(false);
  const [chatHistoryId, setChatHistoryId] = useState<string>();
  const [openSearchKnowledgeModal, setOpenSearchKnowledgeModal] =
    useState(false);
  const [openMessageConfigModal, setOpenMessageConfigModal] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openServiceStatusModal, setOpenServiceStatusModal] = useState(false);
  const [openUpdateServiceInfoModal, setOpenUpdateServiceInfoModal] =
    useState(false);

  // 상세 정보 query
  const {
    data: chatbotDetailData,
    isLoading,
    refetch: refetchChatbotDetail,
  } = useQuery({
    queryKey: ['chatbot-detail', chatbotId],
    queryFn: () => getChatBotDetailApi({ id: chatbotId ?? '' }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: (data) => {
      if (data) {
        return data.payload;
      }
      return null;
    },
  });

  // 지식베이스 연계 해제 query
  const { mutate: deleteChatBotKnowledgeBase } = useMutation({
    mutationFn: (info: DeleteChatBotKnowledgeBaseParams) =>
      deleteChatBotKnowledgeBaseApi(info),
    onSuccess: () => {
      toast.success('지식베이스 연계 해제 완료', {
        duration: 2000,
        position: 'top-center',
      });
      refetchChatbotDetail();
    },
    onError: () => {
      toast.error('지식베이스 연계 해제 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 지식베이스 변경 쿼리
  const { mutate: updateKnowledgeBase } = useMutation({
    mutationFn: (info: UpdateChatBotKnowledgeBaseParams) =>
      updateChatBotKnowledgeBaseApi(info),
    onSuccess: () => {
      toast.success('지식베이스 변경 완료', {
        duration: 2000,
        position: 'top-center',
      });
      refetchChatbotDetail();
    },
    onError: () => {
      toast.error('지식베이스 변경 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 프롬프트 미리보기 query
  const { mutate: previewChatBotPrompt, data: previewPromptString } =
    useMutation({
      mutationFn: (info: PreviewChatBotPromptParams) =>
        previewChatBotPromptApi(info),
    });

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // 챗봇 사용상태 변경 query
  const { mutate: updateChatBotStatus } = useMutation({
    mutationFn: (info: UpdateChatBotStatusParams) =>
      updateChatBotStatusApi(info),
    onSuccess: () => {
      toast.success('챗봇 사용상태 변경 완료', {
        duration: 2000,
        position: 'top-center',
      });
      refetchChatbotDetail();
      setOpenServiceStatusModal(false);
    },
    onError: () => {
      toast.error('챗봇 사용상태 변경 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  useEffect(() => {
    if (chatbotDetailData) {
      previewChatBotPrompt({
        promptRole: chatbotDetailData.promptOptions.promptRole,
        promptConStyle: chatbotDetailData.promptOptions.promptConStyle,
        promptFormat: chatbotDetailData.promptOptions.promptFormat,
        promptScope: chatbotDetailData.promptOptions.promptScope,
        searchFailMessage: chatbotDetailData.searchFailMessage,
      });
    }
  }, [previewChatBotPrompt, chatbotDetailData]);

  const handleUpdateKnowledgeBase = (data: KnowledgeBaseInfoState | null) => {
    if (data) {
      // 서비스 지식베이스 변경 쿼리 호출
      updateKnowledgeBase({
        chatbotId: chatbotId ?? '',
        knowledgeBaseId: data.id,
      });
    }
    setOpenSearchKnowledgeModal(false);
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full">
      <PageHeader title={`챗봇 서비스 | ${chatbotDetailData?.chatBotName}`} />
      <div id="body" className="flex w-full flex-col gap-10">
        <div id="info-pannel" className="flex w-full flex-col gap-5">
          <div className="flex w-full justify-end gap-2">
            <Button
              className="h-[28px]  border-[#E4E7EB] px-3 hover:bg-white"
              onClick={() => setOpenChatPreviewModal(true)}
            >
              미리보기
            </Button>
            <Button
              className="h-[28px] border-[#0066C3] px-3 text-[#0066C3]"
              onClick={() => setOpenUpdateServiceInfoModal(true)}
            >
              서비스 정보 변경
            </Button>
          </div>
          {openUpdateServiceInfoModal && (
            <UpdateServiceInfoModal
              chatbotInfo={{
                organId: chatbotDetailData?.organId ?? '',
                chatbotId: chatbotId ?? '',
                chatbotName: chatbotDetailData?.chatBotName ?? '',
                description: chatbotDetailData?.description ?? '',
              }}
              closeModal={() => setOpenUpdateServiceInfoModal(false)}
              refetchDetail={refetchChatbotDetail}
            />
          )}
          <div className="flex w-full flex-col gap-4 border-t border-t-black bg-[#F8F9FB] px-5 py-4 text-[#27303F]">
            <div className="flex items-center gap-6">
              <p className="w-[160px] text-sm">회원사명</p>
              <p className="text-lg font-bold">
                {chatbotDetailData?.organName}
              </p>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">서비스명</p>
                <p className="text-lg font-bold">
                  {chatbotDetailData?.chatBotName}
                </p>
              </div>
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">서비스 사용 여부</p>
                <div className="flex items-center gap-6">
                  {chatbotDetailData?.isUsed === 'Y' ? (
                    <div className="h-[20px] w-[43px] rounded-sm bg-[#D5EBFF] text-center text-sm text-[#0066C3]">
                      ON
                    </div>
                  ) : (
                    <div className="h-[20px] w-[43px] rounded-sm bg-[#FEE2E2] text-center text-sm text-[#DC2626]">
                      OFF
                    </div>
                  )}
                  <Button
                    className="px-3 h-7 border-[#0066c3] text-[#0066C3]"
                    onClick={() => setOpenServiceStatusModal(true)}
                  >
                    미사용 전환
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p className="w-[160px] text-sm">서비스 설명</p>
              <p className="text-[15px]">{chatbotDetailData?.description}</p>
            </div>

            <div className="h-[1px] w-full bg-[#D0D5DD]" />

            <div className="flex w-full items-center">
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">생성자</p>
                <p className="text-[15px]">{chatbotDetailData?.createdBy}</p>
              </div>
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">Bearer Token</p>
                <p className="text-[15px]">{chatbotDetailData?.accessToken}</p>
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">최초생성일</p>
                <p className="text-[15px]">
                  {format(
                    new Date(chatbotDetailData?.createdAt ?? ''),
                    'yyyy-MM-dd HH:mm:ss',
                  )}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <p className="w-[160px] text-sm">최근 수정일</p>
                <p className="text-[15px]">
                  {format(
                    new Date(chatbotDetailData?.updatedAt ?? ''),
                    'yyyy-MM-dd HH:mm:ss',
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {openServiceStatusModal && (
          <ServiceStatusModal
            status={chatbotDetailData?.isUsed === 'Y' ? true : false}
            closeModal={() => setOpenServiceStatusModal(false)}
            confirmModal={() => {
              updateChatBotStatus({
                chatbotId: chatbotId ?? '',
                isUsed: chatbotDetailData?.isUsed === 'Y' ? 'N' : 'Y',
              });
            }}
          />
        )}

        {chatbotDetailData && (
          <ChatBotUpdateConfigWrap
            ChatbotDetailData={chatbotDetailData}
            refetchDetail={refetchChatbotDetail}
          />
        )}

        {openChatPreviewModal && (
          <ChatBotModal
            id={chatbotId ?? ''}
            accessToken={chatbotDetailData?.accessToken ?? ''}
            chatHistoryId={chatHistoryId}
            setChatHistoryId={setChatHistoryId}
            closeModal={() => setOpenChatPreviewModal(false)}
          />
        )}

        {/* 메시지 영역 */}
        <div className="w-full grid grid-cols-3 gap-5">
          <ConfigCardLayout
            className="col-span-2"
            title="메시지 및 샘플질문 설정"
            optionButton={
              <img
                className="cursor-pointer"
                src={IconSetting}
                alt="setting"
                onClick={() => setOpenMessageConfigModal(true)}
              />
            }
          >
            <div className="w-full flex flex-col gap-4">
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-bold">초기환영메시지</p>
                  <div className="w-full bg-[#F8F9FB] border border-[#D0D5DD] py-6 px-3 text-[15px] font-medium flex-1">
                    <p>{chatbotDetailData?.welcomeMessage}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-bold">검색 실패 시 메시지</p>
                  <div className="w-full bg-[#F8F9FB] border border-[#D0D5DD] py-6 px-3 text-[15px] font-medium flex-1">
                    <p>{chatbotDetailData?.searchFailMessage}</p>
                  </div>
                </div>
              </div>
              {chatbotDetailData &&
                chatbotDetailData.samplePrompts.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <p className="text-lg font-bold">샘플질문</p>
                    {chatbotDetailData.samplePrompts.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="w-full bg-[#F8F9FB] border border-[#D0D5DD] py-6 px-3 text-[15px] font-medium"
                        >
                          <p>{element}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </ConfigCardLayout>

          <ConfigCardLayout title="프롬프트 템플릿 미리보기">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">프롬프트 템플릿</p>
              <div className="px-3 text-sm font-medium bg-[#F8F9FB] border border-[#D0D5DD] py-10 w-full max-h-[500px] overflow-y-auto flex-1">
                {openPreview ? (
                  <p>{formatText(previewPromptString?.payload ?? '')}</p>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Button
                      className="h-7 px-3"
                      onClick={() => setOpenPreview(true)}
                    >
                      미리보기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ConfigCardLayout>
        </div>
        {openMessageConfigModal && chatbotDetailData && (
          <PromptConfigModal
            chatbotId={chatbotDetailData.id}
            welcomeMessage={chatbotDetailData.welcomeMessage}
            searchFailMessage={chatbotDetailData.searchFailMessage}
            samplePrompts={chatbotDetailData.samplePrompts}
            closeModal={() => setOpenMessageConfigModal(false)}
            refetchDetail={refetchChatbotDetail}
          />
        )}

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center w-full justify-between">
            <p className="text-xl font-bold">연결된 지식베이스</p>
            <Button
              className="px-3 w-fit h-7"
              onClick={() => setOpenSearchKnowledgeModal(true)}
            >
              지식베이스 변경
            </Button>
          </div>
          <DefaultTable
            data={
              chatbotDetailData && chatbotDetailData.knowledgeBaseName
                ? [
                    {
                      knowledgeBaseName: chatbotDetailData.knowledgeBaseName,
                      knowledgeBaseEmbedder:
                        chatbotDetailData.knowledgeBaseEmbedder,
                      knowledgeBaseCreatedAt:
                        chatbotDetailData.knowledgeBaseCreatedAt,
                      knowledgeBaseCreatedBy:
                        chatbotDetailData.knowledgeBaseCreatedBy,
                    },
                  ]
                : []
            }
            headerList={[
              {
                label: '지식베이스명',
                key: 'knowledgeBaseName',
              },
              {
                label: '임베딩모델',
                key: 'knowledgeBaseEmbedder',
              },
              {
                label: '생성일',
                key: 'knowledgeBaseCreatedAt',
              },
              {
                label: '생성자',
                key: 'knowledgeBaseCreatedBy',
              },
              {
                label: '관리',
                key: '',
                render: () => (
                  <Button
                    className="h-[20px] rounded-sm border-[#E60020] px-2 text-[14px] font-normal text-[#E60020]"
                    onClick={() => {
                      if (chatbotDetailData) {
                        deleteChatBotKnowledgeBase({
                          chatbotId: chatbotDetailData.id,
                        });
                      }
                    }}
                  >
                    연계해제
                  </Button>
                ),
              },
            ]}
          />
        </div>

        {/* 지식베이스 찾기 모달 */}
        {openSearchKnowledgeModal && (
          <SearchKnowledgeBaseModal
            title="지식베이스 찾기"
            organName={chatbotDetailData?.organName ?? ''}
            closeModal={() => setOpenSearchKnowledgeModal(false)}
            clickConfirmButton={handleUpdateKnowledgeBase}
          />
        )}
      </div>
    </div>
  );
};

interface ChatBotModalProps {
  id: string;
  accessToken: string;
  chatHistoryId: string | undefined;
  setChatHistoryId: (id: string) => void;
  closeModal: () => void;
}

const ChatBotModal = ({
  id,
  accessToken,
  chatHistoryId,
  setChatHistoryId,
  closeModal,
}: ChatBotModalProps) => {
  // state
  const [referenceList, setReferenceList] = useState<ReferenceFileList[]>([]);
  //   const [referenceList, setReferenceList] = useState<ReferenceFileList[]>([
  //     {
  //       pageContents:
  //         '위임전결규칙  2120\n\n위임전결규칙 \n\n제    정  2009. 5. 4.\n\n일부개정  2009. 9.25.\n\n일부개정  2010. 7.15.\n\n일부개정  2011. 5. 1.\n\n일부개정  2011.11.14.\n\n일부개정  2012. 7.17.\n\n일부개정  2012. 8.20.\n\n일부개정  2013.10.29.\n\n일부개정  2014.10. 6.\n\n일부개정  2014.10.22.\n\n일부개정  2015. 3.24.\n\n일부개정  2015.10. 7.\n\n일부개정  2017. 3.31.\n\n일부개정  2018. 8.23.\n\n일부개정  2021. 2.25.\n\n일부개정  2021. 4.21.\n\n일부개정  2021. 5.24.\n\n일부개정  2021.11.30.\n\n일부개정  2021.12.24.\n\n일부개정  2022. 7. 4.\n\n일부개정  2022. 9.26.\n\n제조목적\n1\n(\n) 이 규칙은 한국에너지기술평가원이하 평가원이라 한다의 각 직위의 직무수행에 \n \n(\n“\n”\n)\n',
  //       fileId: '105',
  //       fileName: '2120_위임전결규칙(2022.9.26).pdf',
  //       fileDownloadUrl: '/static/files/6b6188b9-90e6-4d00-bb2e-e67dde355814',
  //       dataSourceId: 252,
  //       directoryId: '0e1b6ce2-04a3-4a68-852e-ae133e7f44ca',
  //       page: '0',
  //     },
  //   ]);

  // agent 조회 query
  const { data: agentChatData, isLoading } = useQuery({
    queryKey: ['agent-chat'],
    queryFn: () =>
      getAgentChatApi({ chatbotId: id, chatId: chatHistoryId, accessToken }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    gcTime: 0,
    select: (data) => {
      if (data) {
        return data.payload;
      }
      return null;
    },
  });

  useEffect(() => {
    if (agentChatData) {
      setChatHistoryId(agentChatData.chatId);
    }
  }, [agentChatData, setChatHistoryId]);

  return (
    <ModalLayout
      modalWidth="w-[1140px]"
      closeModal={closeModal}
      clickConfirmButton={closeModal}
    >
      <div className="w-full grid grid-cols-2 gap-10 mb-10">
        <div className="w-full flex flex-col">
          <p className="text-2xl font-bold mb-6">미리보기</p>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold">채팅 서비스 미리보기</p>
            <div className="p-3 bg-[#F8F9FB] w-full flex">
              <p className="text-sm text-[#98A2B2]">
                채팅 테스트 시 설정 LLM 모델 과금정책에 따라 비용이 발생합니다.
              </p>
            </div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              agentChatData && (
                <ChatBot
                  detailChat={{
                    welcomeMessage: agentChatData.welcomeMessage,
                    searchFailMessage: agentChatData.searchFailMessage,
                    chatbotId: id,
                    accessToken: accessToken,
                    chatId: agentChatData.chatId,
                    history: agentChatData.agentChatHis,
                  }}
                  setReferenceList={setReferenceList}
                />
              )
            )}
          </div>
        </div>

        <div className="w-full flex flex-col p-5 h-full gap-3 bg-[#F6F7FA] border border-[#D0D5DD] rounded-md">
          <p className="text-lg font-bold">참고자료</p>
          {referenceList.length > 0 && (
            <ReferListCard referenceList={referenceList} />
          )}
        </div>
      </div>
    </ModalLayout>
  );
};

const PromptConfigModal = ({
  chatbotId,
  welcomeMessage,
  searchFailMessage,
  samplePrompts,
  closeModal,
  refetchDetail,
}: {
  chatbotId: string;
  welcomeMessage: string;
  searchFailMessage: string;
  samplePrompts: string[];
  closeModal: () => void;
  refetchDetail: () => void;
}) => {
  // state
  const [updateWelcomeMessage, setUpdateWelcomeMessage] =
    useState(welcomeMessage);
  const [updateSearchFailMessage, setUpdateSearchFailMessage] =
    useState(searchFailMessage);
  const [updateSamplePrompts, setUpdateSamplePrompts] = useState(samplePrompts);

  // 프롬프트 설정 변경 쿼리
  const { mutate: updateChatBotMessageConfig } = useMutation({
    mutationFn: (info: UpdateChatBotMessageConfigParams) =>
      updateChatBotMessageConfigApi(info),
    onSuccess: () => {
      toast.success('프롬프트 설정이 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetchDetail();
      closeModal();
    },
    onError: () => {
      toast.error('프롬프트 설정 변경에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => {
        updateChatBotMessageConfig({
          chatbotId,
          welcomeMessage: updateWelcomeMessage,
          searchFailMessage: updateSearchFailMessage,
          samplePrompts: updateSamplePrompts,
        });
      }}
    >
      <p className="text-2xl mb-6 font-bold">메시지 및 샘플질문 설정</p>
      <div className="flex flex-col gap-4 mb-10">
        <p className="text-lg font-bold">메시지 설정</p>
        <p className="text-[15px] font-medium">초기 환영 메시지*</p>
        <Textarea
          className="w-full h-14 placeholder:text-[#98A2B2]"
          placeholder="대화의 첫 문장을 입력해주세요."
          value={updateWelcomeMessage}
          onChange={(e) => setUpdateWelcomeMessage(e.target.value)}
        />
        <p className="text-[15px] font-medium">검색 실패 시 메시지*</p>
        <Textarea
          className="w-full h-14 placeholder:text-[#98A2B2]"
          placeholder="검색 실패 시 메시지를 입력해주세요."
          value={updateSearchFailMessage}
          onChange={(e) => setUpdateSearchFailMessage(e.target.value)}
        />

        <div className="h-[1px] w-full bg-[#E4E7EB]" />
        <p className="text-lg font-bold">샘플질문 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] w-[116px] font-medium">샘플질문</p>
          <Button
            className="w-fit h-[36px] px-3 bg-[#667183] text-white rounded-sm text-sm font-normal"
            onClick={() => setUpdateSamplePrompts([...updateSamplePrompts, ''])}
          >
            + 샘플질문 추가
          </Button>
        </div>
        <div className="flex gap-5">
          <div className="flex flex-col gap-5">
            {updateSamplePrompts.map((element, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    className="w-[388px] h-9"
                    value={element}
                    onChange={(e) =>
                      setUpdateSamplePrompts(
                        updateSamplePrompts.map((_, i) =>
                          i === index ? e.target.value : _,
                        ),
                      )
                    }
                  />
                  <Button
                    className="h-5 px-2 bg-white border-[#E60020] text-[#E60020] text-sm font-normal"
                    onClick={() =>
                      setUpdateSamplePrompts(
                        updateSamplePrompts.filter((_, i) => i !== index),
                      )
                    }
                  >
                    삭제
                  </Button>
                </div>
              );
            })}
            <p className="text-sm text-[#4C5667]">
              첫 질의 시 사용자에게 노출되는 샘플 질문입니다.
            </p>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};

const ServiceStatusModal = ({
  status,
  closeModal,
  confirmModal,
}: {
  status: boolean;
  closeModal: () => void;
  confirmModal: () => void;
}) => {
  return (
    <ModalLayout
      modalWidth="w-[460px]"
      className="px-5"
      closeModal={closeModal}
      clickConfirmButton={confirmModal}
    >
      <div className="flex flex-col gap-2 w-full mb-8">
        <p className="text-lg font-bold text-[#0066C3] text-center">
          서비스를 {status ? '미사용' : '사용'}상태로 변경하시겠습니까?
        </p>
        <div className="w-full bg-[#F8F9FB] rounded-sm py-3 flex justify-center items-center gap-4">
          <p className="font-bold text-lg">현재 사용여부</p>
          {status ? (
            <div className="h-[20px] w-[43px] rounded-sm bg-[#D5EBFF] text-center text-sm text-[#0066C3]">
              ON
            </div>
          ) : (
            <div className="h-[20px] w-[43px] rounded-sm bg-[#FEE2E2] text-center text-sm text-[#DC2626]">
              OFF
            </div>
          )}
        </div>
        <div className="w-full bg-[#F8F9FB] rounded-sm p-3 text-sm text-[#98A2B2]">
          - {status ? '미사용' : '사용'} 상태 전환 시 사용자에게 서비스가
          노출되지 않습니다.
        </div>
      </div>
    </ModalLayout>
  );
};

const UpdateServiceInfoModal = ({
  chatbotInfo,
  refetchDetail,
  closeModal,
}: {
  chatbotInfo: {
    organId: string;
    chatbotId: string;
    chatbotName: string;
    description: string;
  };
  refetchDetail: () => void;
  closeModal: () => void;
}) => {
  // state
  const [updateChatbotName, setUpdateChatbotName] = useState(
    chatbotInfo.chatbotName,
  );
  const [updateDescription, setUpdateDescription] = useState(
    chatbotInfo.description,
  );
  // 버튼 활성화
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  // 챗봇 서비스 정보 변경 query
  const { mutate: updateChatBotServiceInfo } = useMutation({
    mutationFn: (info: UpdateChatBotServiceInfoParams) =>
      updateChatBotServiceInfoApi(info),
    onSuccess: () => {
      toast.success('챗봇 서비스 정보가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetchDetail();
      closeModal();
    },
    onError: () => {
      toast.error('챗봇 서비스 정보 변경에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 유효성 검사 query
  const { data: chatbotNameAvailable, refetch } = useQuery({
    queryKey: ['chatbotNameAvailable'],
    queryFn: () =>
      checkChatbotNameAvailableApi({
        organId: chatbotInfo.organId,
        chatBotName: updateChatbotName,
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
    if (!updateChatbotName) {
      toast('서비스명을 입력해주세요.', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    const result = await refetch();
    const isAvailable = result.data;

    if (isAvailable) {
      setIsValidated(true);
    }

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

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateChatbotName(e.target.value);
    setIsValidated(false);
  };

  useEffect(() => {
    // 이름이 변경되었는지 확인
    if (updateChatbotName !== chatbotInfo.chatbotName) {
      if (chatbotNameAvailable && isValidated) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    } else {
      setIsButtonDisabled(false);
    }
  }, [
    updateChatbotName,
    chatbotInfo.chatbotName,
    chatbotNameAvailable,
    isValidated,
  ]);

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      isDisabled={isButtonDisabled}
      clickConfirmButton={() => {
        updateChatBotServiceInfo({
          chatbotId: chatbotInfo.chatbotId,
          chatBotName: updateChatbotName,
          description: updateDescription,
        });
      }}
    >
      <p className="text-2xl mb-6 font-bold">챗봇 서비스 정보 변경</p>
      <div className="mb-12 mt-6 flex flex-col gap-4">
        <p className="text-lg font-bold">서비스 기본 정보</p>
        <div className="flex">
          <p className="h-9 flex items-center text-[15px] font-medium w-[100px]">
            회원사명
          </p>
          <div className="flex flex-col gap-1">
            <p className="h-9 flex items-center">plani</p>
            <p className="text-sm text-[#98A2B2]">
              디렉토리의 회원사는 변경하실 수 없습니다.
            </p>
          </div>
        </div>

        <div className="flex">
          <p className="h-9 flex items-center text-[15px] font-medium w-[100px]">
            챗봇 서비스명*
          </p>
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex w-full gap-2">
              <Input
                className="w-full h-9"
                value={updateChatbotName}
                onChange={handleChangeName}
              />
              <Button
                className="h-9 px-3 bg-[#667183] text-white rounded-sm text-sm"
                onClick={handleDuplicateCheck}
              >
                중복확인
              </Button>
            </div>
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
              - 고유한 챗봇 서비스 명을 입력해주세요.
            </div>
          </div>
        </div>

        <div className="flex">
          <p className="h-9 flex items-center text-[15px] font-medium w-[100px]">
            챗봇 서비스명*
          </p>
          <Textarea
            className="flex-1 h-12 placeholder:text-[#98A2B2]"
            placeholder="챗봇 서비스 설명을 입력해주세요."
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
          />
        </div>
      </div>
    </ModalLayout>
  );
};

export default ChatBotServiceDetailPage;
