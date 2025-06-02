import {
  CreateChatBotParams,
  PromptOptions,
  ReferenceFileList,
} from '@/lib/api/chatbot/type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// type
export const RETENTION_PERIOD_LIST = [
  {
    label: '1년',
    value: 'ONE_YEAR',
  },
  {
    label: '2년',
    value: 'TWO_YEAR',
  },
  {
    label: '3년',
    value: 'THREE_YEAR',
  },
  {
    label: '5년',
    value: 'FIVE_YEAR',
  },
];
export const RETRIEVER_TYPE_LIST = [
  {
    label: '의미 기반',
    value: 'SEMANTIC',
  },
  {
    label: '키워드 기반',
    value: 'KEYWORD',
  },
  {
    label: '하이브리드 기반',
    value: 'HYBRID',
  },
];
export const KEYWORD_MATCH_TYPE_LIST = [
  {
    label: '정확히 일치',
    value: 'EXACT_MATCH',
  },
  {
    label: '부분 일치',
    value: 'PARTIAL_MATCH',
  },
];

export const PROMPT_STYLE_LIST = [
  {
    label: '정중한 말투',
    value: 'FORMAL',
  },
  {
    label: '친근한 말투',
    value: 'FRIENDLY',
  },
  {
    label: '전문가 말투',
    value: 'EXPERT',
  },
];

export const PROMPT_FORMAT_LIST = [
  {
    label: '문장',
    value: 'STRING',
  },
  {
    label: '리스트',
    value: 'LIST',
  },
  {
    label: '표',
    value: 'TABLE',
  },
];

export const PROMPT_SCOPE_LIST = [
  {
    label: '지식베이스 내',
    value: 'ONLY_KNOWLEDGE_BASE',
  },
  {
    label: 'LLM 자유생성',
    value: 'LLM_AND_KNOWLEDGE_BASE',
  },
];

export const SOURCE_ENABLED_TYPE_LIST = [
  {
    label: '표시',
    value: 'DISPLAY',
  },
  {
    label: '미표시',
    value: 'HIDE',
  },
];

export interface KnowledgeBaseInfoState {
  number: number;
  id: string;
  name: string;
  embeddingModel: string;
  createdAt: string;
  createdBy: string | null;
}

export interface LLMOptions {
  llmTemperature: string;
  llmTopProbability: string;
  llmMaxTokens: string;
}

// 초기 상태값 정의
const initialState = {
  checkServiceName: false,

  organInfo: {
    organId: '',
    organName: '',
  },
  chatBotName: '',
  description: '',
  chatLogRetentionPeriod: RETENTION_PERIOD_LIST[0]
    .value as CreateChatBotParams['chatLogRetentionPeriod'],
  knowledgeBaseInfo: [],
  retrieverType: RETRIEVER_TYPE_LIST[0]
    .value as CreateChatBotParams['retrieverType'],
  keywordMatchType: KEYWORD_MATCH_TYPE_LIST[0]
    .value as CreateChatBotParams['keywordMatchType'],
  retrieverCount: '5',
  reRankedCount: '3',
  vectorThreshold: '0.6',
  vectorWeight: '0',
  llm: {
    model: '',
    displayName: '',
  },
  llmOptions: {
    llmTemperature: '0.6',
    llmTopProbability: '0.6',
    llmMaxTokens: '1000',
  },
  promptOptions: {
    promptRole: '',
    promptConStyle: PROMPT_STYLE_LIST[0]
      .value as PromptOptions['promptConStyle'],
    promptFormat: PROMPT_FORMAT_LIST[0].value as PromptOptions['promptFormat'],
    promptScope: PROMPT_SCOPE_LIST[0].value as PromptOptions['promptScope'],
  },
  sourceEnabledType: SOURCE_ENABLED_TYPE_LIST[0]
    .value as CreateChatBotParams['sourceEnabledType'],
  welcomeMessage: '',
  searchFailMessage: '',
  samplePrompts: [],

  // 참고자료
  referenceList: [],
};

interface CreateChatbotStoreState {
  checkServiceName: boolean | undefined;
  setCheckServiceName: (val: boolean | undefined) => void;

  // 챗봇 기본 정보
  organInfo: {
    organId: string;
    organName: string;
  };
  setOrganInfo: (val: { organId: string; organName: string }) => void;
  chatBotName: string;
  setChatBotName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  chatLogRetentionPeriod: CreateChatBotParams['chatLogRetentionPeriod'];
  setChatLogRetentionPeriod: (
    val: CreateChatBotParams['chatLogRetentionPeriod'],
  ) => void;
  knowledgeBaseInfo: KnowledgeBaseInfoState[];
  setKnowledgeBaseInfo: (val: KnowledgeBaseInfoState[]) => void;

  //   리트리버 설정
  retrieverType: CreateChatBotParams['retrieverType'];
  setRetrieverType: (val: CreateChatBotParams['retrieverType']) => void;
  keywordMatchType: CreateChatBotParams['keywordMatchType'];
  setKeywordMatchType: (val: CreateChatBotParams['keywordMatchType']) => void;
  retrieverCount: string; // 검색 결과 수
  setRetrieverCount: (val: string) => void;
  reRankedCount: string; // 재정렬 결과 수
  setReRankedCount: (val: string) => void;
  vectorThreshold: string; // 최소 유사도 임계값
  setVectorThreshold: (val: string) => void;
  vectorWeight: string; // 벡터 가중치
  setVectorWeight: (val: string) => void;

  // LLM 모델 설정
  llm: {
    model: string;
    displayName: string;
  };
  setLLM: (val: { model: string; displayName: string }) => void;
  llmOptions: LLMOptions;
  setLLMOptions: (val: LLMOptions) => void;

  // 프롬프트 설정
  promptOptions: PromptOptions;
  setPromptOptions: (val: PromptOptions) => void;

  // 출처 표시 설정
  sourceEnabledType: CreateChatBotParams['sourceEnabledType'];
  setSourceEnabledType: (val: CreateChatBotParams['sourceEnabledType']) => void;

  // 메시지 및 샘플질문
  welcomeMessage: string;
  setWelcomeMessage: (val: string) => void;
  searchFailMessage: string;
  setSearchFailMessage: (val: string) => void;
  samplePrompts: string[];
  setSamplePrompts: (val: string[]) => void;

  // 채팅 결과 참고자료
  referenceList: ReferenceFileList[];
  setReferenceList: (val: ReferenceFileList[]) => void;

  // 초기화
  resetCreateChatbotStore: () => void;
}

const useCreateChatbotStore = create<CreateChatbotStoreState>()(
  devtools((set) => ({
    ...initialState,
    setCheckServiceName: (val) =>
      set(() => ({
        checkServiceName: val,
      })),
    // setters
    setOrganInfo: (val) =>
      set(() => ({
        organInfo: val,
      })),
    setChatBotName: (val) =>
      set(() => ({
        chatBotName: val,
      })),
    setDescription: (val) =>
      set(() => ({
        description: val,
      })),
    setChatLogRetentionPeriod: (val) =>
      set(() => ({
        chatLogRetentionPeriod: val,
      })),
    setKnowledgeBaseInfo: (val) =>
      set(() => ({
        knowledgeBaseInfo: val,
      })),

    // 리트리버 설정
    setRetrieverType: (val) =>
      set(() => ({
        retrieverType: val,
      })),
    setKeywordMatchType: (val) =>
      set(() => ({
        keywordMatchType: val,
      })),
    setRetrieverCount: (val) =>
      set(() => ({
        retrieverCount: val,
      })),
    setReRankedCount: (val) =>
      set(() => ({
        reRankedCount: val,
      })),
    setVectorThreshold: (val) =>
      set(() => ({
        vectorThreshold: val,
      })),
    setVectorWeight: (val) =>
      set(() => ({
        vectorWeight: val,
      })),
    setLLM: (val) =>
      set(() => ({
        llm: val,
      })),
    setLLMOptions: (val) =>
      set(() => ({
        llmOptions: val,
      })),

    // 프롬프트 설정
    setPromptOptions: (val) =>
      set(() => ({
        promptOptions: val,
      })),

    // 출처 표시 설정
    setSourceEnabledType: (val) =>
      set(() => ({
        sourceEnabledType: val,
      })),

    // 메시지 및 샘플질문
    setWelcomeMessage: (val) =>
      set(() => ({
        welcomeMessage: val,
      })),
    setSearchFailMessage: (val) =>
      set(() => ({
        searchFailMessage: val,
      })),
    setSamplePrompts: (val) =>
      set(() => ({
        samplePrompts: val,
      })),

    // 채팅 결과 참고자료
    setReferenceList: (val) =>
      set(() => ({
        referenceList: val,
      })),

    // 초기화
    resetCreateChatbotStore: () => set(() => ({ ...initialState })),
  })),
);

export default useCreateChatbotStore;
