// GET 회원사 상세 조회
export interface OrganizationDetailParams {
  organId: string;
}

export interface OrganizationDetailResponse {
  id: string;
  organName: string;
  organHeadName: string | null;
  descriptioon: string | null;
  bizRegNo: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  logo: FileData | null;
  bizCert: FileData;
  passbookCopy: FileData;
  isCategoryEnabled: boolean;
  isCategoryVisible: boolean;
}

export interface FileData {
  id: number;
  originalFileName: string;
  fileDownloadUrl: string;
}
