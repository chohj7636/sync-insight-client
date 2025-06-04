import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import {
  AddDataAccessLevelParams,
  AddDataAccessLevelResponse,
  DeleteDataAccessLevelParams,
  DeleteDataAccessLevelResponse,
  SyncDataParams,
  SyncDataResponse,
  TransferDataAccessLevelParams,
  TransferDataAccessLevelResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

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
