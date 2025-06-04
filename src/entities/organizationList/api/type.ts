// GET 회원사 목룍 가지고오기
export interface OrganizationsListParams {
  organName?: string;
  bizRegNo?: string;
  statuses?: 'ACTIVE' | 'INACTIVE';
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  size?: number;
  sort?: 'createdAt,ASC' | 'createdAt,DESC';
}

export interface OrganizationsListResponse {
  code: string;
  message: string;
  payload: OrganizationsListResponsePayload;
}

export interface OrganizationsListResponsePayload {
  content: OrganizationListData[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

export interface OrganizationListData {
  id: string;
  organName: string;
  bizRegNo: string;
  adminName: string;
  adminPhone: string;
  adminEmail: string;
  createAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}
