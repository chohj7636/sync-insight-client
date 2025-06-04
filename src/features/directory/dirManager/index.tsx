import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import { getDirectoriesList } from '@/lib/api/datasource/api';
import DefaultSelect from '@/shared/components/DefaultSelect';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { DefaultPagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/button';
import SearchFilterPanel from '@/widgets/SearchFilterPanel';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const DirManager = () => {
  const navigate = useNavigate();

  const HEADERLIST = [
    { label: '순번', key: 'index', style: 'w-[60px]' },
    { label: '회원사명', key: 'organName' },
    { label: '디렉토리명', key: 'dirName' },
    {
      label: '데이터 소유권 보호',
      key: 'isOwnershipSecured',
      render: (value: string | boolean) => {
        if (typeof value === 'boolean') {
          return value ? '활성화' : '비활성화';
        }
        return value === 'ACTIVE' ? '이용중' : '이용중지';
      },
    },
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
    { label: '생성자', key: 'createdBy' },
    {
      label: '관리',
      key: 'dirId',
      style: 'w-[100px]',
      render: (value: string) => (
        <div
          className="mx-auto h-5 w-[63px] cursor-pointer rounded-sm border border-[#0066C3] text-center"
          onClick={() => navigate(`/datasource/detail/${value}`)}
        >
          <p className="text-[14px] font-normal text-[#0066C3]">상세보기</p>
        </div>
      ),
    },
  ];
  // state
  const [organName, setOrganName] = useState<string | undefined>();
  const [dirName, setDirName] = useState<string | undefined>();
  const [creatorName, setCreatorName] = useState<string | undefined>();
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // query
  const { data, refetch } = useQuery({
    queryKey: ['directories'],
    queryFn: () =>
      getDirectoriesList({
        organName,
        dirName,
        createdBy: creatorName,
        createdAtFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        createdAtTo: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
        page,
        size,
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [page, size, refetch]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SearchFilterPanel
        setOrganName={setOrganName}
        secondInputLabel="디렉토리명"
        setSecondInputValue={setDirName}
        setCreatorName={setCreatorName}
        date={date}
        setDate={setDate}
        clickSearch={() => refetch()}
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
            className="h-[28px] rounded-sm bg-[#0066C3] px-3 text-sm text-white"
            onClick={() => navigate('/datasource/register')}
          >
            + 디렉토리 신규 등록
          </Button>
        </div>
      </div>

      {/* 테이블 컴포넌트 */}
      {data?.payload.content ? (
        <DefaultTable
          data={data.payload.content}
          headerList={HEADERLIST}
          headerStyle="h-[53px]"
          bodyStyle="h-[45px]"
        />
      ) : (
        <div>데이터가 없습니다.</div>
      )}

      <DefaultPagination
        totalPages={data?.payload.totalPages ?? 0}
        currentPage={page + 1}
        setCurrentPage={(prevPage) => {
          setPage(prevPage - 1);
        }}
      />
    </div>
  );
};

export default DirManager;
