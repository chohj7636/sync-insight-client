import axios from 'axios';

import config from '../config-api.json';
import {
  AddDataAccessLevelParams,
  AddDataAccessLevelResponse,
  ChangeCategoryEnabledParams,
  ChangeCategoryEnabledResponse,
  ChangeCategoryVisibleParams,
  ChangeCategoryVisibleResponse,
  ChangeOrganizationInfoParams,
  ChangeOrganizationInfoResponse,
  ChangeOrganizationLogoParams,
  ConnectDirectoryParams,
  ConnectDirectoryResponse,
  DeleteCategoryParams,
  DeleteCategoryResponse,
  DeleteDataAccessLevelParams,
  DeleteDataAccessLevelResponse,
  GetCategoryDirectoryListParams,
  GetCategoryDirectoryListResponse,
  GetCategoryListParams,
  GetCategoryListResponse,
  GetOrganizationDetailParams,
  GetOrganizationDetailResponse,
  PostCategoryListUpdateParams,
  PostCategoryListUpdateResponse,
  SyncDataParams,
  SyncDataResponse,
  TransferDataAccessLevelParams,
  TransferDataAccessLevelResponse,
  getDataAccessLevelListParams,
  getDataAccessLevelListResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// GET 회원사 상세 조회
export const getOrganizationDetailApi = async (
  info: GetOrganizationDetailParams,
) => {
  const response = await axios.get<GetOrganizationDetailResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 회원사 로고 변경
export const postChangeOrganLogo = async (
  info: ChangeOrganizationLogoParams,
) => {
  const formData = new FormData();
  formData.append('file', info.file);

  const response = await axios.post(
    `${apiInfo.api_url}/organizations/${info.organId}/logo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// PUT 회원사 기본정보 변경
export const putChangeOrganizationInfo = async (
  info: ChangeOrganizationInfoParams,
) => {
  const response = await axios.put<ChangeOrganizationInfoResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}`,
    {
      organHeadName: info.organHeadName,
      bizRegNo: info.bizRegNo,
      description: info.description,
      adminName: info.adminName,
      adminEmail: info.adminEmail,
      adminPhone: info.adminPhone,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 회원사별 데이터등급 조회
export const getDataAccessLevelList = async (
  info: getDataAccessLevelListParams,
) => {
  const response = await axios.get<getDataAccessLevelListResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/data-access-levels`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 데이터 등급 추가
export const postAddDataAccessLevelApi = async (
  info: AddDataAccessLevelParams,
) => {
  const response = await axios.post<AddDataAccessLevelResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/data-access-levels`,
    info.dataAccessLevelList,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// DELETE 데이터등급 삭제
export const deleteDataAccessLevelApi = async (
  info: DeleteDataAccessLevelParams,
) => {
  const response = await axios.delete<DeleteDataAccessLevelResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/data-access-levels/${info.dataAccessLevelName}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 데이터등급 이관 및 삭제
export const patchTransferDataAccessLevelApi = async (
  info: TransferDataAccessLevelParams,
) => {
  const response = await axios.patch<TransferDataAccessLevelResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/data-source/change-data-access-levels`,
    {
      prevLevelName: info.prevLevelName,
      newLevelName: info.newLevelName,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 데이터 동기화 (회원사 지식베이스 전체 동기화 요청)
export const getSyncDataApi = async (info: SyncDataParams) => {
  const response = await axios.get<SyncDataResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/sync`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 카테고리 조회
export const getCategoryListApi = async (info: GetCategoryListParams) => {
  const response = await axios.get<GetCategoryListResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 카테고리 소속 디렉토리 검색
export const getCategoryDirectoryListApi = async (
  info: GetCategoryDirectoryListParams,
) => {
  const response = await axios.get<GetCategoryDirectoryListResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories/directories`,
    {
      params: {
        categoryIds: info.categoryIds,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 카테고리 리스트 업데이트
export const postCategoryListUpdateApi = async (
  info: PostCategoryListUpdateParams,
) => {
  const response = await axios.post<PostCategoryListUpdateResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories`,
    info.categoryList,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// DELETE 카테고리 삭제
export const deleteCategoryApi = async (info: DeleteCategoryParams) => {
  const response = await axios.delete<DeleteCategoryResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories`,
    {
      data: {
        categoryId: info.categoryId,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 카테고리 사용 여부 변경
export const changeCategoryEnabledApi = async (
  info: ChangeCategoryEnabledParams,
) => {
  const response = await axios.patch<ChangeCategoryEnabledResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/category-enabled`,
    {
      isCategoryEnabled: info.isCategoryEnabled,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 카테고리 노출 여부 변경
export const changeCategoryVisibleApi = async (
  info: ChangeCategoryVisibleParams,
) => {
  const response = await axios.patch<ChangeCategoryVisibleResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/category-visible`,
    {
      isCategoryVisible: info.isCategoryVisible,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 카테고리에 디렉토리 연결
export const connectDirectoryApi = async (info: ConnectDirectoryParams) => {
  const response = await axios.post<ConnectDirectoryResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories/directories`,
    {
      directoryIds: info.directoryIds,
      categoryId: info.categoryId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};
