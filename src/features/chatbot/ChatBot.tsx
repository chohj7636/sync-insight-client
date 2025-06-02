import { useEffect, useRef, useState } from 'react';

import { agentChattingApi, previewChattingApi } from '@/lib/api/chatbot/api';
import {
  AgentChattingParams,
  PreviewChattingParams,
  PromptOptions,
  ReferenceFileList,
} from '@/lib/api/chatbot/type';
import { Button } from '@/shared/ui/button';
import { LoadingSpinner } from '@/shared/ui/loadingSpinner';
import { Textarea } from '@/shared/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ChatStackState {
  status: 'request' | 'response';
  message: string;
  refer?: ReferenceFileList[];
}

interface ChatBotProps {
  detailChat?: {
    welcomeMessage: string;
    searchFailMessage: string;
    chatbotId: string;
    accessToken: string;
    chatId: string;
    history: {
      question: string;
      contents: string;
      createdAt: string;
    }[];
  };
  previewData?: {
    retrieverType: 'SEMANTIC' | 'KEYWORD' | 'HYBRID';
    retrieverCount: number;
    reRankedCount: number;
    vectorWeight: number;
    vectorThreshold: number;
    llm: string;
    llmOptions: {
      llmTemperature: number;
      llmTopProbability: number;
      llmMaxTokens: number;
    };
    promptOptions: PromptOptions;
    searchFailMessage: string;
    organId: string;
    knowledgeBaseId: string;
    embedder: string;
  };
  setReferenceList: (refer: ReferenceFileList[]) => void;
}

const ChatBot = ({
  detailChat,
  previewData,
  setReferenceList,
}: ChatBotProps) => {
  const messageEndEl = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  // state
  const [message, setMessage] = useState('');
  const [chatStack, setChatStack] = useState<ChatStackState[]>(() => {
    if (detailChat) {
      const data_temp: ChatStackState[] = [
        {
          status: 'response',
          message: detailChat.welcomeMessage,
        },
      ];

      if (detailChat.history.length > 0) {
        // 디테일 페이지 채팅 모드일때 채팅 히스토리 가지고오기
        detailChat.history.forEach((element) => {
          data_temp.push({
            status: 'request',
            message: element.question,
          });
          data_temp.push({
            status: 'response',
            message: element.contents,
          });
        });
      }
      return data_temp;
    }
    return [];
  });

  // 미리보기 체팅 query
  const { mutate: sendMessageMutation, isPending } = useMutation({
    mutationFn: (info: PreviewChattingParams) => previewChattingApi(info),
    onSuccess: (data) => {
      const data_temp = [...chatStack];

      if (data.payload.generated === 'N') {
        data_temp.push({
          status: 'response',
          message: previewData?.searchFailMessage ?? '',
        });
      } else {
        data_temp.push({
          status: 'response',
          message: data.payload.contents,
          refer: data.payload.agentChatFiles,
        });
      }
      setChatStack(data_temp);
    },
    onError: (error: AxiosError) => {
      if (error.status === 500) {
        toast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
          position: 'top-center',
          duration: 2000,
        });
      } else {
        toast('채팅 전송 실패', {
          position: 'top-center',
          duration: 2000,
        });
      }
    },
  });

  // 디테일 페이지 채팅 query
  const { mutate: agentChattingMutation, isPending: isAgentChattingPending } =
    useMutation({
      mutationFn: (info: AgentChattingParams) => agentChattingApi(info),
      onSuccess: (data) => {
        const data_temp = [...chatStack];
        if (data.payload.generated === 'N') {
          data_temp.push({
            status: 'response',
            message: detailChat?.searchFailMessage ?? '',
          });
        } else {
          data_temp.push({
            status: 'response',
            message: data.payload.contents,
            refer: data.payload.agentChatFiles,
          });
        }

        setChatStack(data_temp);
      },
      onError: (error) => {
        console.log(error);
        toast('채팅 전송 실패', {
          position: 'top-center',
          duration: 2000,
        });
      },
    });

  const sendMessage = () => {
    //   chatbot api 로딩중에는 API 동작하지 않음
    if (isPending || isAgentChattingPending) {
      console.log('pending...');
      return true;
    }
    // input message 초기화
    setMessage('');

    const data_temp = [...chatStack];
    // 기존 chatStack에 입력한 채팅 push
    data_temp.push({
      status: 'request',
      message,
    });
    setChatStack(data_temp);

    // 프리뷰 모드일때 call api
    if (previewData) {
      sendMessageMutation({
        question: message,
        retrieverType: previewData.retrieverType,
        retrieverCount: previewData.retrieverCount,
        reRankedCount: previewData.reRankedCount,
        vectorWeight: previewData.vectorWeight,
        vectorThreshold: previewData.vectorThreshold,
        llm: previewData.llm,
        llmOptions: previewData.llmOptions,
        promptOptions: previewData.promptOptions,
        searchFailMessage: previewData.searchFailMessage,
        organId: previewData.organId,
        knowledgeBaseId: previewData.knowledgeBaseId,
        embedder: previewData.embedder,
      });
    }

    // 디테일 페이지 채팅 모드일때 call api
    if (detailChat) {
      agentChattingMutation({
        chatbotId: detailChat.chatbotId,
        accessToken: detailChat.accessToken,
        chatId: detailChat.chatId,
        question: message,
      });
    }
  };

  // textarea enter
  const handleOnKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter') {
      // 한글 작성시 엔터이벤트 발생했을때 두번 눌리던 현상 방지
      if (event.nativeEvent.isComposing) {
        return true;
      }

      // Shift + Enter인 경우 줄바꿈 허용
      if (event.shiftKey) {
        return true;
      }

      event.preventDefault(); // Enter 키의 기본 동작(줄바꿈) 방지
      sendMessage();
    }
  };

  useEffect(() => {
    if (messageEndEl.current && chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatStack]);

  return (
    <div className="w-full border border-[#D0D5DD] bg-[#F6F7FA] pt-12 pb-5 px-7 flex flex-col gap-4 rounded-md">
      {/* chatbot body */}
      <div
        ref={chatBodyRef}
        id="chat-body"
        className="h-[650px] overflow-y-auto flex flex-col justify-between [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* header */}
        <div className="w-full flex items-center justify-center">
          <p className="text-2xl text-[26px] text-center font-bold">
            안녕하세요.
            <br />
            무엇을 도와드릴까요?
          </p>
        </div>
        {/* chat history */}
        <div className="w-full flex flex-col gap-4">
          {chatStack.map((chat, index) => (
            <div
              id="message-wrapper"
              key={index}
              className={`flex w-full items-center ${
                chat.status === 'request' ? 'justify-end' : 'justify-start'
              }`}
            >
              {chat.status === 'request' ? (
                <div className="rounded-md bg-[#0066C3] px-5 py-3 max-w-[70%]">
                  <p className="break-words text-lg font-medium text-white">
                    {chat.message}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-[#D0D5DD] bg-white px-5 py-3 max-w-[70%] flex flex-col gap-2">
                  <p className="break-words text-lg font-medium">
                    {chat.message}
                  </p>
                  {chat.refer && chat.refer.length > 0 && (
                    <Button
                      className="px-3 py-1 w-fit"
                      onClick={() => chat.refer && setReferenceList(chat.refer)}
                    >
                      참고자료 보기
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* loading */}
          <div ref={messageEndEl}>
            {isPending ? <LoadingSpinner /> : null}
            {isAgentChattingPending ? <LoadingSpinner /> : null}
          </div>
        </div>
      </div>

      {/* input wrapper */}
      <div className="w-full flex items-center">
        <Textarea
          className="h-14 bg-white resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleOnKeyPress}
        />
        <Button onClick={sendMessage}>전송</Button>
      </div>
    </div>
  );
};

export default ChatBot;
