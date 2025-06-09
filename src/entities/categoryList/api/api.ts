import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import { GetCategoryListParams, GetCategoryListResponse } from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

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
