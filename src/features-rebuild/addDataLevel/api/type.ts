// POST 데이터 등급 추가
export interface AddDataAccessLevelParams {
  organId: string;
  dataAccessLevelList: AddDataAccessLevelList[];
}

export interface AddDataAccessLevelResponse {
  code: string;
  message: string;
  payload: string;
}

export interface AddDataAccessLevelList {
  name: string;
  description: string;
}
