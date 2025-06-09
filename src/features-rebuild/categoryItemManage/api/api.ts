import config from '@/shared/lib/config-api.json';
import axios from 'axios';

import {
  ConnectDirectoryParams,
  ConnectDirectoryResponse,
  DeleteCategoryParams,
  DeleteCategoryResponse,
  PostCategoryListUpdateParams,
  PostCategoryListUpdateResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// POST 카테고리 리스트 업데이트
export const postCategoryListUpdateApi = async (
  info: PostCategoryListUpdateParams,
) => {
  const response = await axios.post<PostCategoryListUpdateResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories`,
    info.categoryList,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// DELETE 카테고리 삭제
export const deleteCategoryApi = async (info: DeleteCategoryParams) => {
  const response = await axios.delete<DeleteCategoryResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories`,
    {
      data: {
        categoryId: info.categoryId,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 카테고리에 디렉토리 연결
export const connectDirectoryApi = async (info: ConnectDirectoryParams) => {
  const response = await axios.post<ConnectDirectoryResponse>(
    `${apiInfo.api_url}/organizations/${info.organId}/categories/directories`,
    {
      directoryIds: info.directoryIds,
      categoryId: info.categoryId,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};
