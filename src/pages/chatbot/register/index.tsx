import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '@/components/PageHeader';
import ChatBotServiceDetail from '@/features/chatbot/createChatbot/ChatBotServiceDetail';
import ChatbotBaseInfo from '@/features/chatbot/createChatbot/ChatbotBaseInfo';
import { createChatBotApi } from '@/lib/api/chatbot/api';
import useCreateChatbotStore from '@/shared/hooks/useCreateChatbotStore';
import { Button } from '@/shared/ui/button';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const MENULIST: {
  title: string;
  value: 'basic' | 'detail' | 'agent';
}[] = [
  {
    title: '1 서비스 기본 정보',
    value: 'basic',
  },
  {
    title: '2 서비스 상세 설정',
    value: 'detail',
  },
  {
    title: '3 에이전트 실행조건',
    value: 'agent',
  },
];

const ChatbotRegisterPage = () => {
  const navigate = useNavigate();
  // zustand
  const {
    checkServiceName,
    // 생성 params
    chatBotName,
    description,
    chatLogRetentionPeriod,
    retrieverType,
    retrieverCount,
    reRankedCount,
    vectorThreshold,
    vectorWeight,
    keywordMatchType,
    llm,
    llmOptions,
    promptOptions,
    sourceEnabledType,
    welcomeMessage,
    searchFailMessage,
    knowledgeBaseInfo,
    organInfo,
    samplePrompts,
    // reset
    resetCreateChatbotStore,
  } = useCreateChatbotStore();

  // state
  const [subMenu, setSubMenu] = useState<'basic' | 'detail' | 'agent'>('basic');

  // 챗봇 생성 query
  const { mutate: createChatbot } = useMutation({
    mutationFn: createChatBotApi,
    onSuccess: () => {
      toast('챗봇 생성이 완료되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      navigate('/chatbot/list');
    },
    onError: () => {
      toast('챗봇 생성에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const printFeatureArea = () => {
    switch (subMenu) {
      case 'basic':
        return <ChatbotBaseInfo />;
      case 'detail':
        return <ChatBotServiceDetail />;
      case 'agent':
        return null;
    }
  };

  const submitCreateChatbot = () => {
    createChatbot({
      chatBotName,
      description,
      chatLogRetentionPeriod,
      retrieverType,
      retrieverCount: Number(retrieverCount),
      reRankedCount: Number(reRankedCount),
      vectorThreshold: Number(vectorThreshold),
      vectorWeight: Number(vectorWeight),
      keywordMatchType,
      llm: llm.model as 'string',
      llmOptions: {
        llmTemperature: Number(llmOptions.llmTemperature),
        llmTopProbability: Number(llmOptions.llmTopProbability),
        llmMaxTokens: Number(llmOptions.llmMaxTokens),
      },
      promptOptions,
      sourceEnabledType,
      welcomeMessage,
      searchFailMessage,
      knowledgeBaseId:
        knowledgeBaseInfo.length > 0 ? knowledgeBaseInfo[0].id : undefined,
      organId: organInfo.organId,
      isUsed: 'Y',
      samplePrompts,
    });
  };

  useEffect(() => {
    return () => resetCreateChatbotStore();
  }, [resetCreateChatbotStore]);

  return (
    <div className="w-full">
      <PageHeader title="챗봇 서비스 생성" />
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
              setSubMenu((prev) => (prev === 'detail' ? 'basic' : 'detail'))
            }
          >
            이전 단계로 이동
          </Button>
        )}
        <Button
          className={`h-[52px] w-[200px] rounded-[8px] px-9 text-[15px] font-bold ${
            subMenu === 'agent'
              ? 'bg-[#0066C3] text-white'
              : 'border border-[#0066C3] text-[#0066C3]'
          }`}
          onClick={() => {
            if (subMenu === 'agent') {
              submitCreateChatbot();
            } else if (subMenu === 'basic') {
              if (!checkServiceName) {
                toast('서비스명을 확인해주세요.', {
                  duration: 2000,
                  position: 'top-center',
                });
                return;
              }
              setSubMenu((prev) => (prev === 'basic' ? 'detail' : 'agent'));
            } else {
              // detail
              if (
                !promptOptions.promptRole ||
                !welcomeMessage ||
                !searchFailMessage
              ) {
                toast('필수 항목을 입력해주세요.', {
                  duration: 2000,
                  position: 'top-center',
                });
                return;
              }
              setSubMenu((prev) => (prev === 'basic' ? 'detail' : 'agent'));
            }
          }}
        >
          {subMenu === 'agent' ? '완료' : '다음 단계로 이동'}
        </Button>
      </div>
    </div>
  );
};

export default ChatbotRegisterPage;
