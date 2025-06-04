import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import { DataAccessLevelListParams, DataAccessLevelListResponse } from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// GET 회원사별 데이터등급 조회
export const getDataAccessLevelListApi = async (
  info: DataAccessLevelListParams,
) => {
  const response = await axios.get<DataAccessLevelListResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/data-access-levels`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
