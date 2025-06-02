// GET 회원사 목룍 가지고오기
export interface getOrganizationsListParams {
  organName?: string;
  bizRegNo?: string;
  statuses?: 'ACTIVE' | 'INACTIVE';
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  size?: number;
  sort?: 'createdAt,ASC' | 'createdAt,DESC';
}

export interface getOrganizationsListResponse {
  code: string;
  message: string;
  payload: getOrganizationsListResponsePayload;
}

export interface getOrganizationsListResponsePayload {
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

// GET 회원사 상세 조회
export interface GetOrganizationDetailParams {
  organId: string;
}

export interface GetOrganizationDetailResponse {
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

// GET 회원사별 데이터 등급 조회
export interface getDataAccessLevelListParams {
  organId: string;
}

export interface getDataAccessLevelListResponse {
  code: string;
  message: string;
  payload: DataAccessLevelList[];
}

export interface DataAccessLevelList {
  name: string;
  description: string;
  usedCount: number;
}

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

// GET 카테고리 조회
export interface GetCategoryListParams {
  organId: string;
}

export interface GetCategoryListResponse {
  code: string;
  message: string;
  payload: CategoryList[];
}

export interface CategoryList {
  id: string;
  name: string;
  breadcrumb: string;
  count: number;
  includedSubtreeIds: string[];
  children: CategoryList[];
}

// GET 카테고리 소속 디렉토리 검색
export interface GetCategoryDirectoryListParams {
  organId: string;
  categoryIds: string;
}

export interface GetCategoryDirectoryListResponse {
  code: string;
  message: string;
  payload: CategoryDirectoryList[];
}

export interface CategoryDirectoryList {
  id: string;
  dirName: string;
  categoryId: string;
  categoryName: string;
  categoryBreadcrumb: string;
  createdAt: string;
  updatedAt: string;
  createBy: string | null;
  updateBy: string | null;
}

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
