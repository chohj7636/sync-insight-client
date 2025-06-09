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
