import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import { registerOrganizationParams } from './type';
import { registerOrganizationResponse } from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// POST 회원사 생성
export const postRegisterOrganization = async (
  info: registerOrganizationParams,
) => {
  const response = await axios.post<registerOrganizationResponse>(
    `${apiInfo.api_url}/organizations`,
    {
      organName: info.organName,
      organHeadName: info.organHeadName,
      description: info.description,
      bizRegNo: info.bizRegNo,
      adminName: info.adminName,
      adminPhone: info.adminPhone,
      adminEmail: info.adminEmail,
      logoFile: info.logoFile,
      bizCertFile: info.bizCertFile,
      passbookCopyFile: info.passbookCopyFile,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};
