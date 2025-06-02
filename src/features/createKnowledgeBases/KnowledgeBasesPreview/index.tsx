import { useEffect } from 'react';

import ConfigCard from '@/shared/components/ConfigCard';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { Checkbox } from '@/shared/components/ui/checkbox';
import useCreateKnowledgeBaseStore from '@/shared/hooks/useCreateKnowledgeBaseStore';
import { format } from 'date-fns';

const KnowledgeBasesPreview = () => {
  // zustand state
  const {
    organInfo,
    knowledgeName,
    knowledgeDescription,
    embedderOptions,
    dataSourcesList,
    splitter,
    indexingOptions,
    recursiveLevel,
    textStandard,
    breakPointType,
    breakPointAmount,
    chunkSize,
    chunkOverlap,
    checkNotice,
    setCheckNotice,
  } = useCreateKnowledgeBaseStore();

  // state

  const HEADERLIST = [
    {
      label: '번호',
      key: 'index',
    },
    {
      label: '회원사명',
      key: 'organName',
    },
    {
      label: '데이터소스명',
      key: 'dataSourceName',
    },
    {
      label: '타입',
      key: 'type',
      render: (value: string) => {
        return value === 'DIRECTORY' ? '디렉토리' : 'RDB';
      },
    },
    {
      label: '생성일',
      key: 'createAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      label: '생성자',
      key: 'createBy',
    },
    {
      label: '태그',
      key: 'tags',
      render: (value: string | string[]) => {
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      },
    },
  ];

  // 청킹 설정
  useEffect(() => {
    switch (splitter) {
      case 'RECURSIVE':
      case 'TEXT':
        break;
      case 'SEMANTIC':
        break;
      default:
        break;
    }
  }, [splitter]);

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex w-full flex-col gap-5">
        <p className="text-xl font-bold">지식베이스 기본정보</p>
        <div className="flex w-full flex-col gap-4 border-t border-t-[#667183] bg-[#F8F9FB] px-5 py-4">
          <div className="flex items-center gap-6">
            <p className="w-[160px] text-sm">회원사명</p>
            <p className="text-lg font-bold">{organInfo.organName}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="w-[160px] text-sm">지식베이스명</p>
            <p className="text-lg font-bold">{knowledgeName}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="w-[160px] text-sm">지식베이스 설명</p>
            <p className="text-[15px]">{knowledgeDescription}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-5">
        <p className="text-xl font-bold">데이터 소스</p>
        <DefaultTable data={dataSourcesList} headerList={HEADERLIST} />
      </div>

      <div className="grid w-full grid-cols-3 gap-7">
        <div className="flex w-full flex-col gap-5">
          <p className="text-xl font-bold">임베딩 설정</p>
          <ConfigCard
            data={[
              { title: '임베딩 모델', value: embedderOptions.embedder },
              { title: '임베딩 차원', value: embedderOptions.vectorSize },
              {
                title: '인덱싱 방식',
                value: indexingOptions.indexingTypeLabel,
              },
              {
                title: '인덱싱 주기',
                value: indexingOptions.indexingScheduleLabel,
              },
            ]}
          />
        </div>
        <div className="flex w-full flex-col gap-5">
          <p className="text-xl font-bold">청킹 설정</p>
          <ConfigCard
            data={
              splitter === 'SEMANTIC'
                ? [
                    {
                      title: '청킹 방식',
                      value: splitter,
                    },
                    { title: '분할 기준 타입', value: breakPointType },
                    { title: breakPointType, value: breakPointAmount },
                  ]
                : [
                    {
                      title: '청킹 방식',
                      value: splitter,
                    },
                    { title: '토큰 수', value: chunkSize },
                    { title: '중첩(Overlap) 토큰 수', value: chunkOverlap },
                    {
                      title:
                        splitter === 'RECURSIVE'
                          ? '재귀 분할 허용 깊이'
                          : '분할 기준',
                      value:
                        splitter === 'RECURSIVE'
                          ? recursiveLevel
                          : textStandard,
                    },
                  ]
            }
          />
        </div>
        <div className="flex w-full flex-col gap-5">
          <p className="text-xl font-bold">텍스트 전처리 설정</p>
          <ConfigCard
            data={[
              { title: '텍스트 정규화', value: '대소문자 통일, 특수문자 제거' },
            ]}
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-sm border border-[#D0D5DD] py-6">
        <p className="text-lg font-bold text-[#E60020]">유의사항 안내</p>
        <div className="text-sm">
          <p>
            - 지식베이스에 연결된 데이터 소스는 임베딩과 청킹 설정값에 따라
            벡터화되어 저장됩니다.
          </p>
          <p>
            - 임베딩 설정 또는 청킹 설정 변경 시 재벡터화하는 비용 및 시간이
            추가 발생하므로 설정 변경이 불가합니다.
          </p>
          <p>
            - 동일 파일로 임베딩 설정 또는 청킹 방법을 다르게 적용하려면 신규
            지식베이스를 생성하여야 합니다.
          </p>
        </div>
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => setCheckNotice(!checkNotice)}
        >
          <Checkbox checked={checkNotice} />
          <p className="text-[15px] font-medium">
            위 유의사항을 읽고 확인했습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasesPreview;
