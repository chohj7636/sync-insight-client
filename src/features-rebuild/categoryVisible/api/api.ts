import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import {
  ChangeCategoryVisibleParams,
  ChangeCategoryVisibleResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

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
