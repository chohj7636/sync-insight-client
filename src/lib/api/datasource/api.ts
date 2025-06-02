import axios from 'axios';

import config from '../config-api.json';
import {
  KnowledgeBaseListInDirectoryParams,
  KnowledgeBaseListInDirectoryResponse,
  changeDataAccessLevelParams,
  changeDataAccessLevelResponse,
  checkDirNameAvailableParams,
  checkDirNameAvailableResponse,
  createDirectoryParams,
  createDirectoryResponse,
  deleteDirectoryParams,
  deleteDirectoryResponse,
  deleteFilesParams,
  deleteFilesResponse,
  getDirectoriesListParams,
  getDirectoriesListResponse,
  getDirectoryDetailParams,
  getDirectoryDetailResponse,
  searchDirectoryFilesParams,
  searchDirectoryFilesResponse,
  updateDirectoryParams,
  updateDirectoryResponse,
  uploadDirectoryFileParams,
  uploadDirectoryFileResponse,
} from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

// GET 디렉토리 목록 가지고오기
export const getDirectoriesList = async (info: getDirectoriesListParams) => {
  const response = await axios.get<getDirectoriesListResponse>(
    `${apiInfo.api_url}/directories`,
    {
      params: {
        organId: info.organId,
        organName: info.organName,
        dirName: info.dirName,
        createdBy: info.createdBy,
        createdAtFrom: info.createdAtFrom,
        createdAtTo: info.createdAtTo,
        page: info.page,
        size: info.size,
        sort: info.sort,
        isCategorized: info.isCategorized,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 디렉토리명 유효성 검사
export const checkDirNameAvailable = async (
  info: checkDirNameAvailableParams,
) => {
  const response = await axios.get<checkDirNameAvailableResponse>(
    `${apiInfo.api_url}/directories/check-name-available`,
    {
      params: {
        organId: info.organId,
        dirName: info.dirName,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 디렉토리 생성
export const postCreateDirectory = async (info: createDirectoryParams) => {
  const response = await axios.post<createDirectoryResponse>(
    `${apiInfo.api_url}/directories`,
    info,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 디렉토리 상세보기
export const getDirectoryDetail = async (info: getDirectoryDetailParams) => {
  const response = await axios.get<getDirectoryDetailResponse>(
    `${apiInfo.api_url}/directories/${info.dirId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PUT 디렉토리 수정
export const updateDirectoryInfo = async (info: updateDirectoryParams) => {
  const response = await axios.put<updateDirectoryResponse>(
    `${apiInfo.api_url}/directories/${info.dirId}`,
    info,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// DELETE 디렉토리 삭제
export const deleteDirectory = async (info: deleteDirectoryParams) => {
  const response = await axios.delete<deleteDirectoryResponse>(
    `${apiInfo.api_url}/directories/${info.id}`,
    { withCredentials: true },
  );
  return response.data;
};

// POST 디렉토리 파일 첨부
export const uploadDirectoryFile = async (info: uploadDirectoryFileParams) => {
  const formData = new FormData();

  info.files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await axios.post<uploadDirectoryFileResponse>(
    `${apiInfo.api_url}/directories/${info.dirId}/files`,
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

// GET 디렉토리 파일 목록 조회
export const searchDirectoryFiles = async (
  info: searchDirectoryFilesParams,
) => {
  const response = await axios.get<searchDirectoryFilesResponse>(
    `${apiInfo.api_url}/directories/${info.dirId}/files`,
    {
      params: {
        originalFileName: info.originalFileName,
        page: info.page,
        size: info.size,
      },
    },
  );
  return response.data;
};

// DELETE 디렉토리 파일 삭제
export const deleteFiles = async (info: deleteFilesParams) => {
  const response = await axios.delete<deleteFilesResponse>(
    `${apiInfo.api_url}/files`,
    {
      data: info.id,
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 디렉토리 파일 다운로드
export const downloadDirectoryFile = async (info: string) => {
  const response = await axios.get(`/static/files/${info}`, {
    withCredentials: true,
    responseType: 'blob',
  });
  return response.data;
};

// PATCH 데이터 등급 변경
export const changeDataAccessLevel = async (
  info: changeDataAccessLevelParams,
) => {
  const response = await axios.patch<changeDataAccessLevelResponse>(
    `${apiInfo.api_url}/directories/${info.dirId}/files`,
    {
      accessLevel: info.accessLevel,
      ids: info.ids,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 연계된 지식베이스 조회
export const knowledgeBaseListInDirApi = async (
  info: KnowledgeBaseListInDirectoryParams,
) => {
  const response = await axios.get<KnowledgeBaseListInDirectoryResponse>(
    `${apiInfo.api_url}/directories/${info.dirId}/get-knowledge-base`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
