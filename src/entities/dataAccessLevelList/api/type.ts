// GET 회원사별 데이터 등급 조회
export interface DataAccessLevelListParams {
  organId: string;
}

export interface DataAccessLevelListResponse {
  code: string;
  message: string;
  payload: DataAccessLevelList[];
}

export interface DataAccessLevelList {
  name: string;
  description: string;
  usedCount: number;
}
