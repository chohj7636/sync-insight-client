import axios from 'axios';

import config from '../config-api.json';
import {
  AddDataSourceParams,
  AvailableEmbeddingModelListResponse,
  CheckKnowledgeBaseNameAvailableResponse,
  CreateKnowledgeBaseParams,
  DeleteDataSourceParams,
  GetDirectoryListByKnowledgeBaseParams,
  GetDirectoryListByKnowledgeBaseResponse,
  GetServiceListByKnowledgeBaseParams,
  GetServiceListByKnowledgeBaseResponse,
  PatchDataSourceTagParams,
  SearchKnowledgeBaseDetailParams,
  SearchKnowledgeBaseDetailResponse,
  SearchKnowledgeBaseListParams,
  SearchKnowledgeBaseListResponse,
  SyncKnowledgeBaseParams,
  UpdateKnowledgeBaseInfoParams,
} from './type';
import { CheckKnowledgeBaseNameAvailableParams } from './type';

const env = import.meta.env.PROD;
let { apiInfo } = config;

if (!env) {
  apiInfo = config.apiInfo_dev;
}

export const checkKnowledgeBaseNameAvailableApi = async (
  info: CheckKnowledgeBaseNameAvailableParams,
) => {
  const response = await axios.get<CheckKnowledgeBaseNameAvailableResponse>(
    `${apiInfo.api_url}/knowledge-bases/check-name-available`,
    {
      params: info,
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 가용 임베딩 모델 조회
export const getAvailableEmbeddingModelListApi = async () => {
  const response = await axios.get<AvailableEmbeddingModelListResponse[]>(
    `${apiInfo.api_url}/system/embedders`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 지식베이스 생성
export const createKnowledgeBaseApi = async (
  info: CreateKnowledgeBaseParams,
) => {
  const response = await axios.post(
    `${apiInfo.api_url}/knowledge-bases`,
    info,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 지식베이스 목록 조회
export const getKnowledgeBaseListApi = async (
  info: SearchKnowledgeBaseListParams,
) => {
  const response = await axios.get<SearchKnowledgeBaseListResponse>(
    `${apiInfo.api_url}/knowledge-bases`,
    {
      params: info,
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 지식베이스 상세 조회
export const getKnowledgeBaseDetailApi = async (
  info: SearchKnowledgeBaseDetailParams,
) => {
  const response = await axios.get<SearchKnowledgeBaseDetailResponse>(
    `${apiInfo.api_url}/knowledge-bases/${info.id}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// GET 지식베이스 연결된 디렉토리 조회
export const getDirectoryListByKnowledgeBaseApi = async (
  info: GetDirectoryListByKnowledgeBaseParams,
) => {
  const response = await axios.get<GetDirectoryListByKnowledgeBaseResponse>(
    `${apiInfo.api_url}/knowledge-bases/${info.id}/get-directory`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// DELETE 데이토 소스 삭제 (연계해제)
export const deleteDataSourceApi = async (info: DeleteDataSourceParams) => {
  const response = await axios.delete(`${apiInfo.api_url}/data-sources`, {
    data: info,
    withCredentials: true,
  });
  return response.data;
};

// PUT 지식베이스 정보 수정
export const updateKnowledgeBaseInfoApi = async (
  info: UpdateKnowledgeBaseInfoParams,
) => {
  const response = await axios.put(
    `${apiInfo.api_url}/knowledge-bases/${info.id}`,
    {
      knowledgeName: info.knowledgeName,
      description: info.description,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 데이터소스 태그 수정
export const patchDataSourceTagApi = async (info: PatchDataSourceTagParams) => {
  const response = await axios.patch(
    `${apiInfo.api_url}/data-sources/${info.dataSourceIds}`,
    {
      dataSourceTags: info.dataSourceTags,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// PATCH 지식베이스 동기화 요청
export const syncKnowledgeBaseApi = async (info: SyncKnowledgeBaseParams) => {
  const response = await axios.patch(
    `${apiInfo.api_url}/knowledge-bases/${info.id}/sync`,
    info.dataSourceTags,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

// POST 데이터 소스(디렉토리) 추가
export const addDataSourceApi = async (info: AddDataSourceParams) => {
  const response = await axios.post(`${apiInfo.api_url}/data-sources`, info, {
    withCredentials: true,
  });
  return response.data;
};

// GET 지식베이스 연결된 서비스 조회
export const getServiceListByKnowledgeBaseApi = async (
  info: GetServiceListByKnowledgeBaseParams,
) => {
  const response = await axios.get<GetServiceListByKnowledgeBaseResponse>(
    `${apiInfo.api_url}/knowledge-bases/${info.knowledgeBaseId}/get-chat`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
