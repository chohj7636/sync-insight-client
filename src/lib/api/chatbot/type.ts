// GET 챗봇 유효성 검사
export interface CheckChatbotNameAvailableParams {
  organId: string;
  chatBotName: string;
}

export interface CheckChatbotNameAvailableResponse {
  code: string;
  message: string;
  payload: boolean;
}

// GET LLM 모델 조회
export interface GetLLMModelListResponse {
  by: string;
  key: string;
  model: string;
  displayName: string;
  description: string;
}

// POST 챗봇 생성
export interface CreateChatBotParams {
  chatBotName: string;
  description: string;
  chatLogRetentionPeriod: 'ONE_YEAR' | 'TWO_YEAR' | 'THREE_YEAR' | 'FIVE_YEAR';
  retrieverType: 'SEMANTIC' | 'KEYWORD' | 'HYBRID';
  retrieverCount: number;
  reRankedCount: number;
  vectorThreshold: number;
  vectorWeight: number;
  keywordMatchType: 'EXACT_MATCH' | 'PARTIAL_MATCH';
  llm: 'string';
  llmOptions: LLMOptions;
  promptOptions: PromptOptions;
  sourceEnabledType: 'DISPLAY' | 'HIDE';
  welcomeMessage: string;
  searchFailMessage: string;
  knowledgeBaseId?: string;
  organId: string;
  isUsed: 'Y' | 'N';
  samplePrompts: string[];
}

export interface CreateChatBotResponse {
  code: string;
  message: string;
  payload: string;
}

export interface LLMOptions {
  llmTemperature: number;
  llmTopProbability: number;
  llmMaxTokens: number;
}

export interface PromptOptions {
  promptRole: string;
  promptConStyle: 'FORMAL' | 'FRIENDLY' | 'EXPERT';
  promptFormat: 'STRING' | 'LIST' | 'TABLE';
  promptScope: 'ONLY_KNOWLEDGE_BASE' | 'LLM_AND_KNOWLEDGE_BASE';
}

// POST 채팅 미리보기
export interface PreviewChattingParams {
  question: string;
  retrieverType: 'SEMANTIC' | 'KEYWORD' | 'HYBRID';
  retrieverCount: number;
  reRankedCount: number;
  vectorWeight: number;
  vectorThreshold: number;
  llm: string;
  llmOptions: LLMOptions;
  promptOptions: PromptOptions;
  searchFailMessage: string;
  organId: string;
  knowledgeBaseId: string;
  embedder: string;
}

export interface PreviewChattingResponse {
  code: string;
  message: string;
  payload: ChatBotResponse;
}

export interface ChatBotResponse {
  generated: string;
  contents: string;
  agentChatFiles: ReferenceFileList[];
}

export interface ReferenceFileList {
  fileId: string;
  fileName: string;
  pageContents: string;
  fileDownloadUrl: string;
  dataSourceId: number;
  directoryId: string;
  page: string;
}

// GET 챗봇 서비스 목록 조회
export interface SearchChatBotListParams {
  chatBotName?: string;
  organName?: string;
  createdBy?: string;
  isUsed?: 'Y' | 'N';
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  size?: number;
  sort?: 'createdAt,ASC' | 'createdAt,DESC';
}

export interface SearchChatBotListResponse {
  code: string;
  message: string;
  payload: SearchChatBotListPayload;
}

export interface SearchChatBotListPayload {
  content: ChatBotList[];
  totalPages: number;
  totalElements: number;
  size: number;
}

export interface ChatBotList {
  id: string;
  chatBotName: string;
  organName: string;
  description: string;
  isUsed: 'Y' | 'N';
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
}

// GET 챗봇 서비스 상세 조회
export interface ChatBotDetailParams {
  id: string;
}

export interface ChatBotDetailResponse {
  code: string;
  message: string;
  payload: ChatBotDetailInfo;
}

export interface ChatBotDetailInfo {
  id: string;
  organId: string;
  organName: string;
  chatBotName: string;
  description: string;
  isUsed: 'Y' | 'N';
  accessToken: string;
  retrieverType: 'SEMANTIC' | 'KEYWORD' | 'HYBRID';
  retrieverCount: number;
  reRankedCount: number;
  vectorWeight: number;
  vectorThreshold: number;
  keywordMatchType: 'EXACT_MATCH' | 'PARTIAL_MATCH';
  llm: string;
  llmOptions: LLMOptions;
  promptOptions: PromptOptions;
  sourceEnabledType: 'DISPLAY' | 'HIDE';
  welcomeMessage: string;
  searchFailMessage: string;
  samplePrompts: string[];
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  knowledgeBaseEmbedder: string;
  knowledgeBaseCreatedAt: string;
  knowledgeBaseCreatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

// GET agent(챗봇) 조회
export interface GetAgentChatParams {
  chatbotId: string;
  chatId?: string;
  accessToken: string;
}

export interface GetAgentChatResponse {
  code: string;
  message: string;
  payload: AgentChatPayload;
}

export interface AgentChatPayload {
  chatId: string;
  chatBotName: string;
  description: string;
  promptRole: string;
  llmMaxTokens: string;
  promptConStyle: 'FORMAL' | 'FRIENDLY' | 'EXPERT';
  promptFormat: 'STRING' | 'LIST' | 'TABLE';
  promptScope: 'ONLY_KNOWLEDGE_BASE' | 'LLM_AND_KNOWLEDGE_BASE';
  sourceEnabledType: 'DISPLAY' | 'HIDE';
  welcomeMessage: string;
  searchFailMessage: string;
  samplePrompts: string[];
  agentChatHis: AgentChatHistory[];
}

export interface AgentChatHistory {
  question: string;
  contents: string;
  createdAt: string;
}

// POST agent(챗봇) 채팅
export interface AgentChattingParams {
  chatbotId: string;
  accessToken: string;
  chatId: string;
  // chatRequestType: 'API' | 'CREATE_TEST' | 'DETAIL_TEST';
  question: string;
}

export interface AgentChattingResponse {
  code: string;
  message: string;
  payload: ChatBotResponse;
}

// DELETE 챗봇 지식베이스 연결 해제
export interface DeleteChatBotKnowledgeBaseParams {
  chatbotId: string;
}

export interface DeleteChatBotKnowledgeBaseResponse {
  code: string;
  message: string;
  payload: string;
}

// POST 챗봇 지식베이스 변경
export interface UpdateChatBotKnowledgeBaseParams {
  chatbotId: string;
  knowledgeBaseId: string;
}

export interface UpdateChatBotKnowledgeBaseResponse {
  code: string;
  message: string;
  payload: string;
}

// PATCH 리트리버 설정 변경
export interface UpdateRetrieverConfigParams {
  chatbotId: string;
  retrieverType: 'SEMANTIC' | 'KEYWORD' | 'HYBRID';
  retrieverCount: number;
  reRankedCount: number;
  vectorThreshold: number;
  vectorWeight: number;
  keywordMatchType: 'EXACT_MATCH' | 'PARTIAL_MATCH';
}

export interface UpdateRetrieverConfigResponse {
  code: string;
  message: string;
  payload: string;
}

// PATCH 챗봇 LLM 설정 변경
export interface UpdateChatBotLLMConfigParams {
  chatbotId: string;
  llm: string;
  llmTemperature: number;
  llmTopProbability: number;
  llmMaxTokens: number;
}

export interface UpdateChatBotLLMConfigResponse {
  code: string;
  message: string;
  payload: string;
}

// PATCH 챗봇 프롬프트 설정 변경
export interface UpdateChatBotPromptConfigParams {
  chatbotId: string;
  promptRole: string;
  promptConStyle: 'FORMAL' | 'FRIENDLY' | 'EXPERT';
  promptFormat: 'STRING' | 'LIST' | 'TABLE';
  promptScope: 'ONLY_KNOWLEDGE_BASE' | 'LLM_AND_KNOWLEDGE_BASE';
  sourceEnabledType: 'DISPLAY' | 'HIDE';
}

export interface UpdateChatBotPromptConfigResponse {
  code: string;
  message: string;
  payload: string;
}

// PATCH 챗봇 메시지 및 샘플질문 설정 변경
export interface UpdateChatBotMessageConfigParams {
  chatbotId: string;
  welcomeMessage: string;
  searchFailMessage: string;
  samplePrompts: string[];
}

export interface UpdateChatBotMessageConfigResponse {
  code: string;
  message: string;
  payload: string;
}

// POST 챗봇 프롬프트 미리보기
export interface PreviewChatBotPromptParams {
  promptRole: string;
  promptConStyle: 'FORMAL' | 'FRIENDLY' | 'EXPERT';
  promptFormat: 'STRING' | 'LIST' | 'TABLE';
  promptScope: 'ONLY_KNOWLEDGE_BASE' | 'LLM_AND_KNOWLEDGE_BASE';
  searchFailMessage: string;
}

export interface PreviewChatBotPromptResponse {
  code: string;
  message: string;
  payload: string;
}

// PATCH 챗봇 사용상태 변경
export interface UpdateChatBotStatusParams {
  chatbotId: string;
  isUsed: 'Y' | 'N';
}

export interface UpdateChatBotStatusResponse {
  code: string;
  message: string;
  payload: boolean;
}

// PATCH 챗봇 서비스 정보 변경
export interface UpdateChatBotServiceInfoParams {
  chatbotId: string;
  chatBotName: string;
  description: string;
}

export interface UpdateChatBotServiceInfoResponse {
  code: string;
  message: string;
  payload: string;
}
