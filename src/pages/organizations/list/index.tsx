import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import useGetOrganList from '@/entities/organizationList/hooks/useGetOrganList';
import PageHeader from '@/shared/components/PageHeader';
import OrganizationListTableWrap from '@/widgets/OrganizationListTableWrap';
import SearchFilterPanel from '@/widgets/SearchFilterPanel';
import { format } from 'date-fns';

const OrganizationsListPage = () => {
  // state
  const [organName, setOrganName] = useState<string | undefined>();
  const [bizRegNo, setBizRegNo] = useState<string | undefined>();
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | undefined>(
    undefined,
  );
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // query
  const { isLoadingOrganList, organListData, refetchOrganList } =
    useGetOrganList({
      organParams: {
        organName,
        bizRegNo,
        statuses: status,
        createdAtFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        createdAtTo: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
        page,
        size,
      },
    });

  useEffect(() => {
    refetchOrganList();
  }, [page, size, refetchOrganList]);

  return (
    <div className="w-full">
      <PageHeader title="회원사 목록" />
      <div className="flex w-full flex-col gap-6">
        <SearchFilterPanel
          selectList={[
            { label: '이용중', value: 'ACTIVE' },
            { label: '이용중지', value: 'INACTIVE' },
          ]}
          setOrganName={setOrganName}
          secondInputLabel="사업자등록번호"
          setSecondInputValue={setBizRegNo}
          setStatus={(value) => setStatus(value as 'ACTIVE' | 'INACTIVE')}
          date={date}
          setDate={setDate}
          clickSearch={() => refetchOrganList()}
        />
        <OrganizationListTableWrap
          totalElements={organListData?.totalElements ?? 0}
          numberOfElements={organListData?.numberOfElements ?? 0}
          organListData={organListData?.content ?? []}
          size={size}
          setSize={setSize}
          page={page}
          setPage={setPage}
          isLoading={isLoadingOrganList}
        />
      </div>
    </div>
  );
};

export default OrganizationsListPage;
