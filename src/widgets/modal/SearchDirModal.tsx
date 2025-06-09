import { useEffect, useState } from 'react';

import { getDirectoriesList } from '@/lib/api/datasource/api';
import { DirectoryListData } from '@/lib/api/datasource/type';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { DefaultPagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { useSearchDirectoryModal } from '@/shared/hooks/modals/useSearchDirectoryModal';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export const SearchDirModal = () => {
  // zustand
  const {
    isOpen,
    setIsOpen,
    title,
    selectedOrganId,
    type,
    selectedDataSource,
    clickConfirmButton,
  } = useSearchDirectoryModal();
  // state
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState(0);

  const [originSelectedData, setOriginSelectedData] = useState<
    DirectoryListData[]
  >(() => selectedDataSource);

  // 디렉토리 목록 조회 query
  const { data: directoryList, refetch } = useQuery({
    queryKey: ['searchDirectoryList'],
    queryFn: () => {
      const params = {
        organId: selectedOrganId,
        size: 10,
        page,
        isCategorized: type === 'CATEGORY' ? false : undefined,
      };
      return getDirectoriesList(params);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  const HEADERLIST = [
    {
      label: '선택',
      key: 'id',
      render: (
        _: string,
        dataItem: Record<string, any> | DirectoryListData,
      ) => (
        <Checkbox
          checked={originSelectedData?.some(
            (file) => file.dirId === dataItem['dirId'],
          )}
          onCheckedChange={(checked) => {
            setOriginSelectedData((prev) => {
              if (checked) {
                return [
                  ...prev,
                  { ...(dataItem as DirectoryListData), type: 'DIRECTORY' },
                ];
              }
              return prev.filter((item) => item.dirId !== dataItem.dirId);
            });
          }}
        />
      ),
    },
    { label: '디렉토리명', key: 'dirName' },
    {
      label: '생성일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
  ];

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const clickConfirm = () => {
    clickConfirmButton(originSelectedData ?? []);
  };

  if (!isOpen) return null;
  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={() => setIsOpen(false)}
      clickConfirmButton={clickConfirm}
    >
      <p className="text-2xl font-bold">{title}</p>
      <div className="mt-6 mb-12 flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <p className="text-[15px] font-medium">선택된 디렉토리</p>
          <div className="flex h-[52px] w-full flex-wrap items-center gap-[10px] overflow-y-auto rounded-md border border-[#D0D5DD] p-3">
            {originSelectedData?.map((element) => {
              return (
                <div
                  key={element.dirId}
                  className="flex cursor-pointer items-center gap-2 rounded-sm bg-[#27303F] px-3 py-1 text-[14px] text-white"
                  onClick={() => {
                    setOriginSelectedData((prev) =>
                      prev?.filter((item) => item.dirId !== element.dirId),
                    );
                  }}
                >
                  <p>{element.dirName}</p>
                  <p>X</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-2">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-white"
              onClick={() => refetch()}
            >
              검색
            </Button>
          </div>

          <DefaultTable
            data={directoryList?.payload.content ?? []}
            headerList={HEADERLIST}
            headerStyle="[&_th]:h-[28px]"
            bodyStyle="[&_td]:py-1"
          />
          <DefaultPagination
            totalPages={directoryList?.payload.totalPages ?? 0}
            currentPage={page + 1}
            setCurrentPage={(prevPage) => {
              setPage(prevPage - 1);
            }}
          />
        </div>
      </div>
    </ModalLayout>
  );
};
