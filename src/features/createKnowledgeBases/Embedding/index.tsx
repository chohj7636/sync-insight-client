import { getAvailableEmbeddingModelListApi } from '@/lib/api/knowledgeBases/api';
import DefaultSelect from '@/shared/components/DefaultSelect';
import { DefaultTable } from '@/shared/components/DefaultTable';
import RegisterCardLayout from '@/shared/components/RegisterCardLayout';
import { Button } from '@/shared/components/ui/button';
import useCreateKnowledgeBaseStore from '@/shared/hooks/useCreateKnowledgeBaseStore';
import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';
import { useQuery } from '@tanstack/react-query';

import ChunkingOptions from './ChunkingOptions';

const HEADERLIST = [
  { label: '청킹방식', key: 'id' },
  { label: '설명', key: 'description' },
  { label: '권장 데이터 형식', key: 'format' },
];

const EmbeddingInfo = () => {
  // zustand state
  const {
    embedderOptions,
    setEmbedderOptions,
    indexingOptions,
    setIndexingOptions,
    splitter,
    setSplitter,
  } = useCreateKnowledgeBaseStore();

  // query
  const { data: embeddingModelList } = useQuery({
    queryKey: ['embeddingModelList'],
    queryFn: getAvailableEmbeddingModelListApi,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  return (
    <div className="flex w-full flex-col gap-7">
      <RegisterCardLayout title="임베딩 기본 설정">
        <div className="flex w-full flex-col gap-4">
          <p className="text-lg font-bold">임베딩 모델</p>
          <p className="text-sm text-[#4C5667]">
            데이터를 색인하기 위한 임베딩 모델을 선택하세요.
          </p>
          <div id="embedding-radio-wrap" className="flex w-full flex-col gap-4">
            {embeddingModelList?.map((element) => {
              return (
                <div
                  key={element.key}
                  className={`flex w-full cursor-pointer items-center rounded-md border-2 bg-white p-5 ${
                    embedderOptions.embedder === element.model
                      ? 'border-[#D5EBFF]'
                      : 'border-[#E4E7EB]'
                  }`}
                  onClick={() =>
                    setEmbedderOptions({
                      ...embedderOptions,
                      embedder: element.model,
                      vectorSize: element.dimension,
                    })
                  }
                >
                  <div className="flex h-12 items-center gap-4">
                    <img
                      src={
                        embedderOptions.embedder === element.model
                          ? ActiveRadioIcon
                          : InactiveRadioIcon
                      }
                      alt="RadioIcon"
                    />
                    <div className="h-12 w-12 bg-[#D9D9D9]" />
                    <div className="flex h-full flex-col justify-between">
                      <p className="text-[16px] font-bold text-nowrap">
                        {element.model}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px]">{element.by}</p>
                        <div className="bg-[#F6F7FA] px-2 text-sm text-[#98A2B2]">
                          벡터차원: {element.dimension}
                        </div>
                      </div>
                    </div>
                    <div className="h-full w-[1px] bg-[#F6F7FA]" />
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex w-fit rounded-sm bg-[#D5EBFF] px-2 text-sm text-[#0066C3]">
                        권장
                      </div>
                      <p className="text-[15px] text-[#667183]">
                        {element.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-[1px] w-full bg-[#F6F7FA]" />

          <p className="text-lg font-bold">인덱싱 설정</p>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px] font-medium">인덱싱 방식</p>
            <DefaultSelect
              className="w-[180px]"
              selectList={[
                {
                  label: '전체 인덱싱',
                  value: 'FULL',
                },
                {
                  label: '증분 인덱싱',
                  value: 'INCREMENTAL',
                },
              ]}
              defaultValue={indexingOptions.indexingType}
              setValue={(value) => {
                setIndexingOptions({
                  ...indexingOptions,
                  indexingType: value as 'FULL' | 'INCREMENTAL',
                  indexingTypeLabel:
                    value === 'FULL'
                      ? '전체 인덱싱'
                      : value === 'INCREMENTAL'
                        ? '증분 인덱싱'
                        : '',
                });
              }}
            />
          </div>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px] font-medium">인덱싱 주기</p>
            <DefaultSelect
              className="w-[180px]"
              selectList={[
                {
                  label: '일회성',
                  value: 'ONE_TIME',
                },
                {
                  label: '일별',
                  value: 'DAILY',
                },
                {
                  label: '주별',
                  value: 'WEEKLY',
                },
                {
                  label: '월별',
                  value: 'MONTHLY',
                },
                {
                  label: '연간',
                  value: 'YEARLY',
                },
              ]}
              defaultValue={indexingOptions.indexingSchedule}
              setValue={(value) => {
                setIndexingOptions({
                  ...indexingOptions,
                  indexingSchedule: value as
                    | 'ONE_TIME'
                    | 'DAILY'
                    | 'WEEKLY'
                    | 'MONTHLY'
                    | 'YEARLY',
                  indexingScheduleLabel:
                    value === 'ONE_TIME'
                      ? '일회성'
                      : value === 'DAILY'
                        ? '일별'
                        : value === 'WEEKLY'
                          ? '주별'
                          : value === 'MONTHLY'
                            ? '월별'
                            : value === 'YEARLY'
                              ? '연간'
                              : '',
                });
              }}
            />
          </div>
        </div>
      </RegisterCardLayout>

      <RegisterCardLayout title="청킹 설정">
        <div className="flex w-full flex-col gap-4">
          <p className="text-lg font-bold">청킹 방식 선택</p>
          <div className="flex items-center gap-4">
            <p className="w-[116px] text-[15px] font-medium">청킹 방식</p>
            <div
              id="button-wrap"
              className="flex h-7 rounded-sm border border-[#E4E7EB]"
            >
              {[
                {
                  label: '재귀적 분할 방식',
                  value: 'RECURSIVE',
                },
                {
                  label: '텍스트 분할 방식',
                  value: 'TEXT',
                },
                {
                  label: '의미론적 분할 방식',
                  value: 'SEMANTIC',
                },
              ].map((element) => {
                return (
                  <Button
                    key={element.value}
                    className={`h-full w-[134px] rounded-sm border-2 text-sm ${
                      splitter === element.value
                        ? 'border-[#0066C3] bg-[#F1F7FD] text-[#0066C3]'
                        : 'border-white bg-white'
                    }`}
                    onClick={() =>
                      setSplitter(
                        element.value as 'RECURSIVE' | 'TEXT' | 'SEMANTIC',
                      )
                    }
                  >
                    {element.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="ml-[116px] max-w-[1050px] pl-4">
            <DefaultTable
              headerStyle="h-[53px]"
              headerList={HEADERLIST}
              bodyStyle="h-[45px]"
              data={[
                {
                  id: '재귀적 분할 방식(Recursive)',
                  description:
                    '문서 구조(문단 → 문장 → 토큰 등)를 재귀적으로 분석하여 가장 적절한 위치에서 분할',
                  format: '구조화된 텍스트(보고서, 뉴스, 정책문서 등)',
                },
                {
                  id: '텍스트 분할 청킹(Character)',
                  description: '일정 문자 수 기준으로 텍스트 분할',
                  format: '비정형 텍스트(로그, 게시글, OCR 문서 등)',
                },
                {
                  id: '의미론적 분할 청킹(Semantic)',
                  description: 'AI가 문맥을 이해하고 의미 단위로 자동 분할',
                  format: '자연어 기반 문서 전반(FAQ, Q&A, 회의록 등)',
                },
              ]}
            />
          </div>
        </div>
      </RegisterCardLayout>

      <ChunkingOptions chunkingType={splitter} />
    </div>
  );
};

export default EmbeddingInfo;
