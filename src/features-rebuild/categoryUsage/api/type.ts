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
