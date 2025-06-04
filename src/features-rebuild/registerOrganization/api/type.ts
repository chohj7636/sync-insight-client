// POST 회원사 생성
export interface registerOrganizationParams {
  organName: string;
  organHeadName: string;
  description?: string;
  bizRegNo: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  logoFile: {
    originalFileName: string;
    data: string;
  } | null;
  bizCertFile: {
    originalFileName: string;
    data: string;
  };
  passbookCopyFile: {
    originalFileName: string;
    data: string;
  };
}

export interface registerOrganizationResponse {
  code: string;
  message: string;
  payload: string;
}
