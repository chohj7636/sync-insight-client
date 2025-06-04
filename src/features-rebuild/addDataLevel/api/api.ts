import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import { AddDataAccessLevelParams, AddDataAccessLevelResponse } from './type';

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
