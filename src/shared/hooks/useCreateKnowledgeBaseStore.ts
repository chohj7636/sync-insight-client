import { DirectoryListData } from '@/lib/api/datasource/type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type DataSourceListType = {
  index: number;
  organName: string;
  dataSourceName: string;
  type: string;
  createAt: string;
  createBy: string | null;
  tags: string[];
  id: string;
};

// 초기 상태값 정의
const initialState = {
  checkServiceName: false,

  selectedDataSource: [],
  organInfo: {
    organId: '',
    organName: '',
  },
  knowledgeName: '',
  knowledgeDescription: '',
  dataSources: [],
  dataSourcesList: [],
  embedderOptions: {
    embedder: 'text-embedding-3-large',
    vectorSize: 3072,
  },
  indexingOptions: {
    indexingType: 'FULL' as const,
    indexingTypeLabel: '전체 인덱싱',
    indexingSchedule: 'ONE_TIME' as const,
    indexingScheduleLabel: '일회성',
  },
  splitter: 'RECURSIVE' as const,
  chunkSize: 512,
  chunkOverlap: 10,
  recursiveLevel: 1,
  textStandard: 1,
  breakPointType: 'PERCENTILE' as const,
  breakPointAmount: 0,
  checkNotice: false,
};

interface CreateKnowledgeBaseStoreState {
  checkServiceName: boolean | undefined;
  setCheckServiceName: (val: boolean | undefined) => void;
  // 데이터 소스 검색에서 불러오는 데이터, (디렉토리 추가 모달을 통해 선택된 데이터소스)
  selectedDataSource: DirectoryListData[];
  setSelectedDataSource: (val: DirectoryListData[]) => void;
  // 지식베이스 기본 정보
  organInfo: {
    organId: string;
    organName: string;
  };
  setOrganInfo: (val: { organId: string; organName: string }) => void;
  knowledgeName: string;
  setKnowledgeName: (val: string) => void;
  knowledgeDescription: string | undefined;
  setKnowledgeDescription: (val: string | undefined) => void;
  dataSources: {
    directoryId: string;
    dataSourceType: 'RELATIONAL_DATABASE' | 'DIRECTORY';
    dataSourceTags: string[];
  }[];
  setDataSources: (
    val: {
      directoryId: string;
      dataSourceType: 'RELATIONAL_DATABASE' | 'DIRECTORY';
      dataSourceTags: string[];
    }[],
  ) => void;
  dataSourcesList: DataSourceListType[];
  setDataSourcesList: (val: DataSourceListType[]) => void;

  // 임베딩 기본 설정
  embedderOptions: {
    embedder: string;
    vectorSize: number;
  };
  setEmbedderOptions: (val: { embedder: string; vectorSize: number }) => void;
  indexingOptions: {
    indexingType: 'FULL' | 'INCREMENTAL';
    indexingTypeLabel: string;
    indexingSchedule: 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    indexingScheduleLabel: string;
  };
  setIndexingOptions: (val: {
    indexingType: 'FULL' | 'INCREMENTAL';
    indexingTypeLabel: string;
    indexingSchedule: 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    indexingScheduleLabel: string;
  }) => void;

  // 청킹 옵션
  splitter: 'RECURSIVE' | 'TEXT' | 'SEMANTIC';
  setSplitter: (val: 'RECURSIVE' | 'TEXT' | 'SEMANTIC') => void;
  chunkSize: number;
  setChunkSize: (val: number) => void;
  chunkOverlap: number;
  setChunkOverlap: (val: number) => void;
  recursiveLevel: number;
  setRecursiveLevel: (val: number) => void;
  textStandard: number;
  setTextStandard: (val: number) => void;
  breakPointType:
    | 'PERCENTILE'
    | 'STANDARD_DEVIATION'
    | 'INTERQUARTILE'
    | 'GRADIENT';
  setBreakPointType: (
    val: 'PERCENTILE' | 'STANDARD_DEVIATION' | 'INTERQUARTILE' | 'GRADIENT',
  ) => void;
  breakPointAmount: number;
  setBreakPointAmount: (val: number) => void;

  // check
  checkNotice: boolean;
  setCheckNotice: (val: boolean) => void;

  // 초기화
  resetCreateKnowledgeBaseStore: () => void;
}

const useCreateKnowledgeBaseStore = create<CreateKnowledgeBaseStoreState>()(
  devtools((set) => ({
    ...initialState,
    // setters
    setCheckServiceName: (val) =>
      set(() => ({
        checkServiceName: val,
      })),
    // 지식베이스 기본 정보
    setSelectedDataSource: (val) =>
      set(() => ({
        selectedDataSource: val,
      })),
    setOrganInfo: (val) =>
      set(() => ({
        organInfo: val,
      })),
    setKnowledgeName: (val) =>
      set(() => ({
        knowledgeName: val,
      })),
    setKnowledgeDescription: (val) =>
      set(() => ({
        knowledgeDescription: val,
      })),
    setDataSources: (val) =>
      set(() => ({
        dataSources: val,
      })),
    setDataSourcesList: (val) =>
      set(() => ({
        dataSourcesList: val,
      })),

    // 임베딩 기본 설정
    setEmbedderOptions: (val) =>
      set(() => ({
        embedderOptions: val,
      })),
    setIndexingOptions: (val) =>
      set(() => ({
        indexingOptions: val,
      })),

    // 청킹 옵션
    setSplitter: (val) =>
      set(() => ({
        splitter: val,
      })),
    setChunkSize: (val) =>
      set(() => ({
        chunkSize: val,
      })),
    setChunkOverlap: (val) =>
      set(() => ({
        chunkOverlap: val,
      })),
    setRecursiveLevel: (val) =>
      set(() => ({
        recursiveLevel: val,
      })),
    setTextStandard: (val) =>
      set(() => ({
        textStandard: val,
      })),
    setBreakPointType: (val) =>
      set(() => ({
        breakPointType: val,
      })),
    setBreakPointAmount: (val) =>
      set(() => ({
        breakPointAmount: val,
      })),

    // check
    setCheckNotice: (val) =>
      set(() => ({
        checkNotice: val,
      })),

    // 초기화
    resetCreateKnowledgeBaseStore: () => set(() => ({ ...initialState })),
  })),
);

export default useCreateKnowledgeBaseStore;
