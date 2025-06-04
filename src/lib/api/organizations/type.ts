export interface FileData {
  id: number;
  originalFileName: string;
  fileDownloadUrl: string;
}

// GET 카테고리 조회
export interface GetCategoryListParams {
  organId: string;
}

export interface GetCategoryListResponse {
  code: string;
  message: string;
  payload: CategoryList[];
}

export interface CategoryList {
  id: string;
  name: string;
  breadcrumb: string;
  count: number;
  includedSubtreeIds: string[];
  children: CategoryList[];
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

// POST 카테고리 리스트 업데이트
export interface PostCategoryListUpdateParams {
  organId: string;
  categoryList: PostCategoryList[];
}

export interface PostCategoryList {
  id: string;
  name: string;
  children: PostCategoryList[];
}
export interface PostCategoryListUpdateResponse {
  code: string;
  message: string;
  payload: string;
}

// DELETE 카테고리 삭제
export interface DeleteCategoryParams {
  organId: string;
  categoryId: string;
}

export interface DeleteCategoryResponse {
  code: string;
  message: string;
  payload: string;
}

// PATCH 카테고리 사용 여부 변경
export interface ChangeCategoryEnabledParams {
  organId: string;
  isCategoryEnabled: boolean;
}

export interface ChangeCategoryEnabledResponse {
  code: string;
  message: string;
  payload: boolean;
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
