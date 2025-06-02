import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import DefaultSelect from '@/components/DefaultSelect';
import { DefaultTable } from '@/components/DefaultTable';
import { DefaultPagination } from '@/components/Pagination';
import SearchFilterPanel from '@/components/SearchFilterPanel';
import { searchChatBotListApi } from '@/lib/api/chatbot/api';
import { Button } from '@/shared/ui/button';
import { LoadingSpinner } from '@/shared/ui/loadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const STATUSES = [
  { label: '이용중', value: 'Y' },
  { label: '이용중지', value: 'N' },
];

const ChatBotList = () => {
  const navigate = useNavigate();
  // state
  const [organName, setOrganName] = useState<string | undefined>();
  const [serviceName, setServiceName] = useState<string | undefined>();
  const [status, setStatus] = useState<'Y' | 'N' | undefined>(undefined);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // 챗봇 목록 조회 query
  const {
    data: chatBotList,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['chatbot-list'],
    queryFn: () =>
      searchChatBotListApi({
        organName,
        chatBotName: serviceName,
        isUsed: status,
        createdAtFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        createdAtTo: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
        page,
        size,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 0,
  });

  const HEADERLIST = [
    { label: '순번', key: 'index', style: 'w-[60px]' },
    { label: '회원사명', key: 'organName' },
    { label: '서비스명', key: 'chatBotName' },
    { label: '설명', key: 'description' },
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
      label: '상태',
      key: 'isUsed',
    },
    {
      label: '생성자',
      key: 'createdBy',
    },
    {
      label: '관리',
      key: 'id',
      render: (value: string) => (
        <div
          className="mx-auto h-5 w-[63px] cursor-pointer rounded-sm border border-[#0066C3] text-center"
          onClick={() => navigate(`/chatbot/list/${value}`)}
        >
          <p className="text-[14px] font-normal text-[#0066C3]">상세보기</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    refetch();
  }, [size, page, refetch]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SearchFilterPanel
        selectList={STATUSES}
        setOrganName={setOrganName}
        secondInputLabel="서비스명"
        setSecondInputValue={setServiceName}
        setStatus={(value) => setStatus(value as 'Y' | 'N')}
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
            onClick={() => navigate('/chatbot/register')}
          >
            + 챗봇 서비스 신규 생성
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <DefaultTable
            data={
              chatBotList?.payload.content.map((item, index) => ({
                index: index + 1,
                organName: item.organName,
                chatBotName: item.chatBotName,
                description: item.description,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                isUsed: item.isUsed === 'Y' ? '이용중' : '이용중지',
                createdBy: item.createdBy,
                id: item.id,
              })) ?? []
            }
            headerList={HEADERLIST}
          />

          <DefaultPagination
            totalPages={chatBotList?.payload.totalPages ?? 0}
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

export default ChatBotList;
