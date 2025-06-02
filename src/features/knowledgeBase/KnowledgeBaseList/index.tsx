import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import SearchFilterPanel from '@/components/SearchFilterPanel';
import DefaultSelect from '@/components/DefaultSelect';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getKnowledgeBaseListApi } from '@/lib/api/knowledgeBases/api';
import { format } from 'date-fns';
import { DefaultTable } from '@/components/DefaultTable';
import { DefaultPagination } from '@/components/Pagination';

const KnowledgeBaseList = () => {
  const navigate = useNavigate();

  const HEADERLIST = [
    { label: '순번', key: 'index', style: 'w-[60px]' },
    { label: '회원사명', key: 'organName' },
    { label: '지식베이스명', key: 'knowledgeName' },
    { label: '임베딩 모델', key: 'embedder' },
    {
      label: '생성일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      label: '최근 수정일',
      key: 'updatedAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      label: '생성자',
      key: 'createdBy',
    },
    {
      label: '관리',
      key: 'id',
      style: 'w-[100px]',
      render: (value: string) => (
        <div
          className="mx-auto h-5 w-[63px] cursor-pointer rounded-sm border border-[#0066C3] text-center"
          onClick={() => navigate(`/knowledge-bases/list/${value}`)}
        >
          <p className="text-[14px] font-normal text-[#0066C3]">상세보기</p>
        </div>
      ),
    },
  ];

  // state
  const [organName, setOrganName] = useState<string | undefined>();
  const [knowledgeBaseName, setKnowledgeBaseName] = useState<
    string | undefined
  >();
  const [creatorName, setCreatorName] = useState<string | undefined>();
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // 지식베이스 목록 조회 query
  const { data: knowledgeBaseList, refetch } = useQuery({
    queryKey: ['knowledge-base-list'],
    queryFn: () =>
      getKnowledgeBaseListApi({
        organName,
        knowledgeName: knowledgeBaseName,
        createdBy: creatorName,
        createdAtFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        createdAtTo: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
        page,
        size,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    refetch();
  }, [size, page, refetch]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SearchFilterPanel
        setOrganName={setOrganName}
        secondInputLabel="지식베이스명"
        setSecondInputValue={setKnowledgeBaseName}
        setCreatorName={setCreatorName}
        date={date}
        setDate={setDate}
        clickSearch={() => refetch()}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">전체 0건 | 검색 0건</p>
        </div>
        <div className="flex items-center gap-2">
          <DefaultSelect
            className="!h-[28px] py-0"
            selectList={[
              {
                label: '20개씩',
                value: '20',
              },
              {
                label: '10개씩',
                value: '10',
              },
            ]}
            defaultValue={size.toString()}
            setValue={(value) => setSize(Number(value))}
          />
          <Button
            className="h-[28px] rounded-sm bg-[#0066C3] px-3 text-sm text-white"
            onClick={() => navigate('/knowledge-bases/register')}
          >
            + 지식베이스 신규 생성
          </Button>
        </div>
      </div>

      <DefaultTable
        data={
          knowledgeBaseList?.payload.content.map((item, index) => ({
            index: index + 1,
            organName: item.organization.organName,
            knowledgeName: item.knowledgeName,
            embedder: item.embedderConfig.model,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            createdBy: item.createdBy,
            id: item.id,
          })) ?? []
        }
        headerList={HEADERLIST}
      />

      <DefaultPagination
        totalPages={knowledgeBaseList?.payload.totalPages ?? 0}
        currentPage={page + 1}
        setCurrentPage={(prevPage) => {
          setPage(prevPage - 1);
        }}
      />
    </div>
  );
};

export default KnowledgeBaseList;
