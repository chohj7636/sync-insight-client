export interface FileData {
  id: number;
  originalFileName: string;
  fileDownloadUrl: string;
}

// GET 카테고리 소속 디렉토리 검색
export interface GetCategoryDirectoryListParams {
  organId: string;
  categoryIds: string;
}

export interface GetCategoryDirectoryListResponse {
  code: string;
  message: string;
  payload: CategoryDirectoryList[];
}

export interface CategoryDirectoryList {
  id: string;
  dirName: string;
  categoryId: string;
  categoryName: string;
  categoryBreadcrumb: string;
  createdAt: string;
  updatedAt: string;
  createBy: string | null;
  updateBy: string | null;
}

// PATCH 카테고리 노출 여부 변경
export interface ChangeCategoryVisibleParams {
  organId: string;
  isCategoryVisible: boolean;
}

export interface ChangeCategoryVisibleResponse {
  code: string;
  message: string;
  payload: boolean;
}

// POST 디렉토리의 카테고리 업데이트 (카테고리 변경, 디렉토리 연결, 해제)
export interface ConnectDirectoryParams {
  organId: string;
  categoryId: string | null;
  directoryIds: string[];
}

export interface ConnectDirectoryResponse {
  code: string;
  message: string;
  payload: string;
}
