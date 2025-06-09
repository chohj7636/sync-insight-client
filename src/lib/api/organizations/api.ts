import axios from 'axios';

import config from '../config-api.json';
import {
  ChangeCategoryVisibleParams,
  ChangeCategoryVisibleResponse,
  ConnectDirectoryParams,
  ConnectDirectoryResponse,
  GetCategoryDirectoryListParams,
  GetCategoryDirectoryListResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

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
