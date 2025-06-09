import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import {
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
