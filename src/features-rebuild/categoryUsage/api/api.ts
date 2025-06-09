import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import {
  ChangeCategoryEnabledParams,
  ChangeCategoryEnabledResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

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
