import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import { OrganizationDetailParams, OrganizationDetailResponse } from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// GET 회원사 상세 조회
export const getOrganizationDetailApi = async (
  info: OrganizationDetailParams,
) => {
  const response = await axios.get<OrganizationDetailResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
