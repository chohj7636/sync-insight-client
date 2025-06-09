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
