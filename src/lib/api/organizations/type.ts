export interface FileData {
  id: number;
  originalFileName: string;
  fileDownloadUrl: string;
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
