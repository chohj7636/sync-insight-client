import { useNavigate } from 'react-router-dom';

import { OrganizationListData } from '@/entities/organizationList/api/type';
import DefaultSelect from '@/shared/components/DefaultSelect';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { DefaultPagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/ui/loadingSpinner';
import { format } from 'date-fns';

interface OrganizationListTableWrapProps {
  isLoading: boolean;
  totalElements: number;
  numberOfElements: number;
  organListData: OrganizationListData[];
  size: number;
  setSize: (size: number) => void;
  page: number;
  setPage: (page: number) => void;
}

const OrganizationListTableWrap = ({
  isLoading,
  totalElements,
  numberOfElements,
  organListData,
  size,
  setSize,
  page,
  setPage,
}: OrganizationListTableWrapProps) => {
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

  return (
    <div className="flex w-full flex-col gap-6">
      {/* table top */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            전체 {totalElements ?? 0}건 | 검색 {numberOfElements ?? 0}건
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
          <DefaultTable data={organListData ?? []} headerList={HEADERLIST} />

          <DefaultPagination
            totalPages={totalElements ?? 0}
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

export default OrganizationListTableWrap;
