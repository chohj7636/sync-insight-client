import axios from 'axios';

import config from '../config-api.json';
import {
  AgentChattingParams,
  AgentChattingResponse,
  ChatBotDetailParams,
  ChatBotDetailResponse,
  CheckChatbotNameAvailableParams,
  CheckChatbotNameAvailableResponse,
  CreateChatBotParams,
  CreateChatBotResponse,
  DeleteChatBotKnowledgeBaseParams,
  DeleteChatBotKnowledgeBaseResponse,
  GetAgentChatParams,
  GetAgentChatResponse,
  GetLLMModelListResponse,
  PreviewChatBotPromptParams,
  PreviewChatBotPromptResponse,
  PreviewChattingParams,
  PreviewChattingResponse,
  SearchChatBotListParams,
  SearchChatBotListResponse,
  UpdateChatBotKnowledgeBaseParams,
  UpdateChatBotKnowledgeBaseResponse,
  UpdateChatBotLLMConfigParams,
  UpdateChatBotLLMConfigResponse,
  UpdateChatBotMessageConfigParams,
  UpdateChatBotMessageConfigResponse,
  UpdateChatBotPromptConfigParams,
  UpdateChatBotPromptConfigResponse,
  UpdateChatBotServiceInfoParams,
  UpdateChatBotServiceInfoResponse,
  UpdateChatBotStatusParams,
  UpdateChatBotStatusResponse,
  UpdateRetrieverConfigParams,
  UpdateRetrieverConfigResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// GET 챗봇 유효성 검사
export const checkChatbotNameAvailableApi = async (
  info: CheckChatbotNameAvailableParams,
) => {
  const response = await axios.get<CheckChatbotNameAvailableResponse>(
    `${apiInfo.api_url}/chat-bot/check-name-available`,
    {
      params: info,
      withCredentials: true,
    },
  );
  return response.data;
};

// GET LLM 모델 조회
export const getLLMModelListApi = async () => {
  const response = await axios.get<GetLLMModelListResponse[]>(
    `${apiInfo.api_url}/system/llmModels`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 챗봇 질의
export const previewChattingApi = async (info: PreviewChattingParams) => {
  const response = await axios.post<PreviewChattingResponse>(
    `${apiInfo.api_url}/chat-bot/chat-preview`,
    info,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 챗봇 서비스 생성
export const createChatBotApi = async (info: CreateChatBotParams) => {
  const response = await axios.post<CreateChatBotResponse>(
    `${apiInfo.api_url}/chat-bot`,
    info,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 챗봇 목록 조회
export const searchChatBotListApi = async (info: SearchChatBotListParams) => {
  const response = await axios.get<SearchChatBotListResponse>(
    `${apiInfo.api_url}/chat-bot`,
    {
      params: info,
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 챗봇 상세 조회
export const getChatBotDetailApi = async (info: ChatBotDetailParams) => {
  const response = await axios.get<ChatBotDetailResponse>(
    `${apiInfo.api_url}/chat-bot/${info.id}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET agent(챗봇) 조회
export const getAgentChatApi = async (info: GetAgentChatParams) => {
  const response = await axios.get<GetAgentChatResponse>(
    `${apiInfo.api_url}/agent/${info.chatbotId}`,
    {
      params: {
        chatId: info.chatId,
      },
      headers: {
        Authorization: `SyncInsightAK ${info.accessToken}`,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// POST agent(챗봇) 채팅
export const agentChattingApi = async (info: AgentChattingParams) => {
  const response = await axios.post<AgentChattingResponse>(
    `${apiInfo.api_url}/agent/${info.chatbotId}`,
    {
      chatId: info.chatId,
      chatRequestType: 'DETAIL_TEST',
      question: info.question,
    },
    {
      headers: {
        Authorization: `SyncInsightAK ${info.accessToken}`,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// DELETE 챗봇 지식베이스 연결 해제
export const deleteChatBotKnowledgeBaseApi = async (
  info: DeleteChatBotKnowledgeBaseParams,
) => {
  const response = await axios.delete<DeleteChatBotKnowledgeBaseResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}/knowledge-base`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 챗봇 지식베이스 변경
export const updateChatBotKnowledgeBaseApi = async (
  info: UpdateChatBotKnowledgeBaseParams,
) => {
  const response = await axios.patch<UpdateChatBotKnowledgeBaseResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}/knowledge-base`,
    {
      knowledgeBaseId: info.knowledgeBaseId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 리트리버 설정 변경
export const updateRetrieverConfigApi = async (
  info: UpdateRetrieverConfigParams,
) => {
  const response = await axios.patch<UpdateRetrieverConfigResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}/retriever`,
    {
      retrieverType: info.retrieverType,
      retrieverCount: info.retrieverCount,
      reRankedCount: info.reRankedCount,
      vectorThreshold: info.vectorThreshold,
      vectorWeight: info.vectorWeight,
      keywordMatchType: info.keywordMatchType,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 챗봇 LLM 설정 변경
export const updateChatBotLLMConfigApi = async (
  info: UpdateChatBotLLMConfigParams,
) => {
  const response = await axios.patch<UpdateChatBotLLMConfigResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}/llm`,
    {
      llm: info.llm,
      llmTemperature: info.llmTemperature,
      llmTopProbability: info.llmTopProbability,
      llmMaxTokens: info.llmMaxTokens,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 챗봇 프롬프트 설정 변경
export const updateChatBotPromptConfigApi = async (
  info: UpdateChatBotPromptConfigParams,
) => {
  const response = await axios.patch<UpdateChatBotPromptConfigResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}/prompt`,
    {
      promptRole: info.promptRole,
      promptConStyle: info.promptConStyle,
      promptFormat: info.promptFormat,
      promptScope: info.promptScope,
      sourceEnabledType: info.sourceEnabledType,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 챗봇 메시지 및 샘플질문 설정 변경
export const updateChatBotMessageConfigApi = async (
  info: UpdateChatBotMessageConfigParams,
) => {
  const response = await axios.patch<UpdateChatBotMessageConfigResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}/message`,
    {
      welcomeMessage: info.welcomeMessage,
      searchFailMessage: info.searchFailMessage,
      samplePrompts: info.samplePrompts,
    },
  );
  return response.data;
};

// POST 챗봇 프롬프트 미리보기
export const previewChatBotPromptApi = async (
  info: PreviewChatBotPromptParams,
) => {
  const response = await axios.post<PreviewChatBotPromptResponse>(
    `${apiInfo.api_url}/chat-bot/chat-prompt-preview`,
    info,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 디렉토리 파일 다운로드
export const downloadReferFile = async (info: string) => {
  const response = await axios.get(`${info}`, {
    withCredentials: true,
    responseType: 'blob',
  });
  return response.data;
};

// PATCH 챗봇 사용상태 변경
export const updateChatBotStatusApi = async (
  info: UpdateChatBotStatusParams,
) => {
  const response = await axios.patch<UpdateChatBotStatusResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}`,
    {
      isUsed: info.isUsed,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 챗봇 서비스 정보 변경
export const updateChatBotServiceInfoApi = async (
  info: UpdateChatBotServiceInfoParams,
) => {
  const response = await axios.patch<UpdateChatBotServiceInfoResponse>(
    `${apiInfo.api_url}/chat-bot/${info.chatbotId}`,
    {
      chatBotName: info.chatBotName,
      description: info.description,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};
