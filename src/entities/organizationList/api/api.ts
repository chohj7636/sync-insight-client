import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import { OrganizationsListParams, OrganizationsListResponse } from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// GET 회원사 목록
export const getOrganizationsList = async (info: OrganizationsListParams) => {
  const response = await axios.get<OrganizationsListResponse>(
    `${apiInfo.api_url}/organizations`,
    {
      params: {
        organName: info.organName,
        bizRegNo: info.bizRegNo,
        statuses: info.statuses,
        createdAtFrom: info.createdAtFrom,
        createdAtTo: info.createdAtTo,
        page: info.page,
        size: info.size,
      },
      withCredentials: true,
    },
  );
  return response.data;
};
