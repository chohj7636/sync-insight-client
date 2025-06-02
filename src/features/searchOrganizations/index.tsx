import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import DefaultSelect from '@/components/DefaultSelect';
import { DefaultTable } from '@/components/DefaultTable';
import { DefaultPagination } from '@/components/Pagination';
import SearchFilterPanel from '@/components/SearchFilterPanel';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { getOrganizationsList } from '@/lib/api/organizations/api';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const STATUSES = [
  { label: '이용중', value: 'ACTIVE' },
  { label: '이용중지', value: 'INACTIVE' },
];

const SearchOrganizations = () => {
  const navigate = useNavigate();

  const HEADERLIST = [
    { label: '순번', key: 'index', style: 'w-[60px]' },
    { label: '회원사명', key: 'organName' },
    { label: '사업자등록번호', key: 'bizRegNo' },
    { label: '관리자명', key: 'adminName' },
    { label: '관리자 연락처', key: 'adminPhone' },
    { label: '관리자 이메일', key: 'adminEmail' },
    {
      label: '등록일',
      key: 'createAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      label: '상태',
      key: 'status',
      render: (value: string) => {
        return value === 'ACTIVE' ? '이용중' : '이용중지';
      },
    },
    {
      label: '상세',
      key: 'id',
      render: (value: string) => (
        <Button
          className="h-5 border-[#0066C3] px-2 text-sm text-[#0066C3]"
          onClick={() => navigate(`/organizations/list/${value}`)}
        >
          상세보기
        </Button>
      ),
    },
  ];

  // query
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () =>
      getOrganizationsList({
        organName,
        bizRegNo,
        statuses: status,
        createdAtFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        createdAtTo: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
        page,
        size,
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // state
  const [organName, setOrganName] = useState<string | undefined>();
  const [bizRegNo, setBizRegNo] = useState<string | undefined>();
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | undefined>(
    undefined,
  );
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const clickSearch = () => {
    console.log({
      organName,
      bizRegNo,
      status,
      date,
      page,
      size,
    });
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [page, size, refetch]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 조회 컴포넌트 */}
      <SearchFilterPanel
        selectList={STATUSES}
        setOrganName={setOrganName}
        secondInputLabel="사업자등록번호"
        setSecondInputValue={setBizRegNo}
        setStatus={(value) => setStatus(value as 'ACTIVE' | 'INACTIVE')}
        date={date}
        setDate={setDate}
        clickSearch={clickSearch}
      />

      {/* table top */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            전체 {data?.payload.totalElements ?? 0}건 | 검색{' '}
            {data?.payload.numberOfElements ?? 0}건
          </p>
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
            className="h-[28px] w-[130px] rounded-sm bg-[#0066C3] text-sm text-white"
            onClick={() => navigate('/organizations/register')}
          >
            + 회원사 신규 등록
          </Button>
        </div>
      </div>

      {/* 테이블 컴포넌트 */}
      {isLoading ? (
        <div className="flex w-full justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <DefaultTable
            data={data?.payload.content ?? []}
            headerList={HEADERLIST}
          />

          <DefaultPagination
            totalPages={data?.payload.totalPages ?? 0}
            currentPage={page + 1}
            setCurrentPage={(prevPage) => {
              setPage(prevPage - 1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default SearchOrganizations;
