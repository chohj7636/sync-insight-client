// GET 지식베이스 유효성 검사
export interface CheckKnowledgeBaseNameAvailableParams {
  organId: string;
  knowledgeName: string;
}

export interface CheckKnowledgeBaseNameAvailableResponse {
  code: string;
  message: string;
  payload: boolean;
}

// POST 지식베이스 생성
export interface CreateKnowledgeBaseParams {
  knowledgeName: string;
  description?: string;

  splitter: 'RECURSIVE' | 'TEXT' | 'SEMANTIC'; // 청킹 방식, (재귀적 | 텍스트 | 의미론적)
  splitterOptions: SplitterOpts;

  embedder: string;

  indexingOptions: IndexingOpts;

  organId: string;

  dataSources: {
    directoryId: string;
    dataSourceType: 'RELATIONAL_DATABASE' | 'DIRECTORY';
    dataSourceTags: string[];
  }[];
}

export interface SplitterOpts {
  chunkSize?: number; // 재귀, 텍스트 (토큰 수)
  chunkOverlap?: number; // 재귀, 텍스트
  recursiveLevel?: number; // 재귀 (재귀 분할 허용 깊이 )
  textStandard?: number; // 텍스트 (분할 기준)
  // 공백 제거 설정 값 백엔드 필드 추가 필요
  // 분할 기준 선택 값 백엔드 필드 추가 필요
  breakPointType?:
    | 'PERCENTILE'
    | 'STANDARD_DEVIATION'
    | 'INTERQUARTILE'
    | 'GRADIENT'; // 의미론적 (표준편차 | 임계값 범위 | 사분위수)
  breakPointAmount?: number;

  // 4월 백엔드 개발범위 아님
  preProcessingType?: string[];
  preProcessingText?: string[];
}

export interface EmbedderOpts {
  key: string;
  model: string;
  displayName: string;
  dimension: string;
  description: string;
  by: string;
}

export interface IndexingOpts {
  indexingType: 'FULL' | 'INCREMENTAL';
  indexingSchedule: 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

// GET 가용 임베딩 모델 조회
export interface AvailableEmbeddingModelListResponse {
  key: string;
  model: string;
  displayName: string;
  dimension: number;
  description: string;
  by: string;
}

// GET 지식베이스 목록 조회
export interface SearchKnowledgeBaseListParams {
  organName?: string;
  knowledgeName?: string;
  createdBy?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  size?: number;
  sort?: 'createdAt,ASC' | 'createdAt,DESC';
}
export interface SearchKnowledgeBaseListResponse {
  code: string;
  message: string;
  payload: KnowledgeBasePayload;
}

export interface KnowledgeBasePayload {
  content: KnowledgeBaseList[];
  totalPages: number;
  totalElements: number;
  size: number;
}

export interface KnowledgeBaseList {
  id: string;
  knowledgeName: string;
  description?: string;

  splitter: 'RECURSIVE' | 'TEXT' | 'SEMANTIC';
  splitterOptions: SplitterOpts;

  embedderConfig: EmbedderOpts;
  indexingOptions: IndexingOpts;

  organization: {
    id: string;
    organName: string;
    bizRegNo: number;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    createAt: string | null;
    status: 'ACTIVE' | 'INACTIVE';
  };

  syncCompletedAt: string | null;
  updatedAt: string;
  createdAt: string | null;
  createdBy: string | null;
}

// GET 지식베이스 상세 조회
export interface SearchKnowledgeBaseDetailParams {
  id: string;
}

export interface SearchKnowledgeBaseDetailResponse {
  code: string;
  message: string;
  payload: KnowledgeBaseList;
}

// GET 지식베이스 연결된 디렉토리 조회
export interface GetDirectoryListByKnowledgeBaseParams {
  id: string;
}

export interface GetDirectoryListByKnowledgeBaseResponse {
  code: string;
  message: string;
  payload: DirectoryList[];
}

export interface DirectoryList {
  id: number;
  dirId: string;
  dirName: string;
  dataSourceType: 'RELATIONAL_DATABASE' | 'DIRECTORY';
  dataSourceTags: string[];
  createdAt: string;
  createdBy: string | null;
  syncCompletedAt: string | null;
}

// PUT 지식베이스 정보 수정
export interface UpdateKnowledgeBaseInfoParams {
  id: string;
  knowledgeName: string;
  description?: string;
}

// DELETE 데이토 소스 삭제 (연계해제)
export interface DeleteDataSourceParams {
  dataSourceIds: number[];
}

// PATCH 데이터소스 태그 수정
export interface PatchDataSourceTagParams {
  dataSourceIds: number;
  dataSourceTags: string[];
}

// PATCH 지식베이스 동기화 요청
export interface SyncKnowledgeBaseParams {
  id: string;
  dataSourceTags: number[];
}

// POST 데이터 소스 추가
export interface AddDataSourceParams {
  knowledgeBaseId: string;
  dataSources: {
    directoryId: string;
    dataSourceType: 'RELATIONAL_DATABASE' | 'DIRECTORY';
    dataSourceTags: string[];
  }[];
}

export interface AddDataSourceResponse {
  code: string;
  message: string;
  payload: string;
}

// GET 지식베이스 연결된 서비스 조회
export interface GetServiceListByKnowledgeBaseParams {
  knowledgeBaseId: string;
}

export interface GetServiceListByKnowledgeBaseResponse {
  code: string;
  message: string;
  payload: ServiceList[];
}

export interface ServiceList {
  id: string;
  chatBotName: string;
  description: string;
  orgId: string;
  orgName: string;
  isUsed: 'Y' | 'N';
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}
