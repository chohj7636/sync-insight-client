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
