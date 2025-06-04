// 회원사 로고 변경
export interface ChangeOrganizationLogoParams {
  organId: string;
  file: File;
}

// PUT 회원사 기본정보 변경
export interface ChangeOrganizationInfoParams {
  organId: string;
  organHeadName: string;
  bizRegNo: string;
  description?: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

export interface ChangeOrganizationInfoResponse {
  code: string;
  message: string;
  payload: string;
}
