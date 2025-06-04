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

// DELETE 데이터등급 삭제
export interface DeleteDataAccessLevelParams {
  organId: string;
  dataAccessLevelName: string;
}

export interface DeleteDataAccessLevelResponse {
  code: string;
  message: string;
  payload: number;
}

// PATCH 데이터등급 이관 및 삭제
export interface TransferDataAccessLevelParams {
  organId: string;
  prevLevelName: string | null;
  newLevelName: string | null;
}

export interface TransferDataAccessLevelResponse {
  code: string;
  message: string;
  payload: string;
}

// GET 데이터 동기화 (회원사 지식베이스 전체 동기화 요청)
export interface SyncDataParams {
  organId: string;
}

export interface SyncDataResponse {
  code: string;
  message: string;
  payload: string;
}
