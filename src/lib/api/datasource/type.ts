// GET 디렉토리 목록 가지고오기
export interface getDirectoriesListParams {
  organId?: string;
  organName?: string;
  dirName?: string;
  createdBy?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  size?: number;
  sort?: 'createdAt,ASC' | 'createdAt,DESC';
  isCategorized?: boolean;
}

export interface getDirectoriesListResponse {
  code: string;
  message: string;
  payload: getDirectoriesListResponsePayload;
}

export interface getDirectoriesListResponsePayload {
  content: DirectoryListData[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

export interface DirectoryListData {
  organId: string;
  organName: string;
  dirId: string;
  dirName: string;
  type?: 'RELATIONAL_DATABASE' | 'DIRECTORY';
  isOwnershipSecured: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

// GET 디렉토리명 유효성 검사
export interface checkDirNameAvailableParams {
  organId: string;
  dirName: string;
}

export interface checkDirNameAvailableResponse {
  code: string;
  message: string;
  payload: boolean;
}

// POST 디렉토리 생성
export interface createDirectoryParams {
  organId: string;
  dirName: string;
  description?: string;
  isOwnershipSecured: boolean;
  categoryId: string;
}

export interface createDirectoryResponse {
  code: string;
  message: string;
  payload: string; // 디렉토리 ID
}

// GET 디렉토리 상세보기
export interface getDirectoryDetailParams {
  dirId: string;
}

export interface getDirectoryDetailResponse {
  code: string;
  message: string;
  payload: DirectoryDetail;
}

export interface DirectoryDetail {
  organId: string;
  organName: string;
  dirId: string;
  dirName: string;
  description: string;
  categoryBreadcrumb: string;
  categoryId: string;
  categoryName: string;
  isOwnershipSecured: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

// PUT 디렉토리 수정
export interface updateDirectoryParams {
  dirId: string;
  dirName: string;
  description?: string;
  isOwnershipSecured: boolean;
}

export interface updateDirectoryResponse {
  code: string;
  message: string;
  payload: string; // 디렉토리 ID
}

// DELETE 디렉토리 삭제
export interface deleteDirectoryParams {
  id: string;
}

export interface deleteDirectoryResponse {
  code: string;
  message: string;
  payload: string;
}

// POST 디렉토리 파일 첨부
export interface uploadDirectoryFileParams {
  dirId: string;
  files: File[];
}

export interface uploadDirectoryFileResponse {
  code: string;
  message: string;
  payload: string[]; // 파일 ID
}

// GET 디렉토리 파일 목록
export interface searchDirectoryFilesParams {
  dirId: string;
  originalFileName?: string;
  page?: number;
  size?: number;
}

export interface searchDirectoryFilesResponse {
  code: string;
  message: string;
  payload: searchDirectoryFilesPayload;
}

export interface searchDirectoryFilesPayload {
  content: DirectoryFileListData[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

export interface DirectoryFileListData {
  id: number;
  savedId: string;
  originalFileName: string;
  extension: string;
  fileSize: number;
  contentType: string;
  accessLevel: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

// Delete Files
export interface deleteFilesParams {
  id: number[];
}

export interface deleteFilesResponse {
  code: string;
  message: string;
  payload: number;
}

// PATCH 데이터 등급 변경
export interface changeDataAccessLevelParams {
  accessLevel: string | null;
  ids: number[];
  dirId: string;
}

export interface changeDataAccessLevelResponse {
  code: string;
  message: string;
  payload: string;
}

// GET 연계된 지식베이스 조회
export interface KnowledgeBaseListInDirectoryParams {
  dirId: string;
}

export interface KnowledgeBaseListInDirectoryResponse {
  code: string;
  message: string;
  payload: KnowledgeBaseList[];
}

export interface KnowledgeBaseList {
  id: number;
  knowledgeBaseId: string;
  knowledgeName: string;
  dataSourceType: 'DIRECTORY' | 'RELATIONAL_DATABASE';
  dataSourceTags: string[];
  createdAt: string;
  createdBy: string | null;
}
