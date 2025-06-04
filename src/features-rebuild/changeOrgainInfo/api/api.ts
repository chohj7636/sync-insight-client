import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import {
  ChangeOrganizationInfoParams,
  ChangeOrganizationInfoResponse,
  ChangeOrganizationLogoParams,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// PUT 회원사 기본정보 변경
export const putChangeOrganizationInfoApi = async (
  info: ChangeOrganizationInfoParams,
) => {
  const response = await axios.put<ChangeOrganizationInfoResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}`,
    {
      organHeadName: info.organHeadName,
      bizRegNo: info.bizRegNo,
      description: info.description,
      adminName: info.adminName,
      adminEmail: info.adminEmail,
      adminPhone: info.adminPhone,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 회원사 로고 변경
export const postChangeOrganLogoApi = async (
  info: ChangeOrganizationLogoParams,
) => {
  const formData = new FormData();
  formData.append('file', info.file);

  const response = await axios.post(
    `${apiInfo.api_url}/organizations/${info.organId}/logo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    },
  );
  return response.data;
};
