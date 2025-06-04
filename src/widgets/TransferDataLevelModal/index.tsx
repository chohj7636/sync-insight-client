import { useEffect, useState } from 'react';

import { DataAccessLevelList } from '@/entities/dataAccessLevelList/api/type';
import { getSyncDataApi } from '@/features-rebuild/dataAccessLevel/api/api';
import { useTransferDataLevel } from '@/features-rebuild/dataAccessLevel/hooks/useTransferDataLevel';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { ModalTable } from '@/shared/components/TableModal';
import useModal from '@/shared/hooks/useModal';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface TransferDataLevelModalProps {
  organId: string;
  prevDataLevel: DataAccessLevelList;
  originDataLevelList: DataAccessLevelList[];
  closeModal: () => void;
  refetchDataAccessLevelList: () => void;
}

export const TransferDataLevelModal = ({
  organId,
  prevDataLevel,
  originDataLevelList,
  closeModal,
  refetchDataAccessLevelList,
}: TransferDataLevelModalProps) => {
  const { modal, modalClose } = useModal();
  // state
  const [selectedDataLevel, setSelectedDataLevel] = useState<string | null>(
    null,
  );

  // 데이터 동기화 query
  const { refetch: refetchSyncData, isSuccess: isSyncSuccess } = useQuery({
    queryKey: ['syncData'],
    queryFn: () => getSyncDataApi({ organId }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  useEffect(() => {
    if (isSyncSuccess) {
      closeModal(); // 데이터 등급 이관 모달 닫기
      modalClose(); // 동기화 모달 닫기
      toast('데이터 동기화가 완료되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    }
  }, [isSyncSuccess, closeModal, modalClose]);

  // 데이터 이관 query
  const { transferDataAccessLevel } = useTransferDataLevel({
    organId,
    prevDataLevel,
    selectedDataLevel,
    closeModal,
    refetchDataAccessLevelList,
    refetchSyncData,
  });

  const clickTableRow = (dataItem: Record<string, any>) => {
    if (dataItem.name === '일반') {
      setSelectedDataLevel(null);
    } else {
      setSelectedDataLevel(dataItem.name);
    }
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => {
        modal({
          title: `'${selectedDataLevel ?? '일반'}' 데이터 등급을 선택하셨습니다.`,
          description: '선택한 데이터 등급으로 변경됩니다.',
          status: 'info',
          eventButton: {
            title: '계속',
            clickEvent: () => {
              // 데이터 이관 API 호출
              transferDataAccessLevel();
            },
          },
        });
      }}
    >
      <p className="mb-6 text-2xl font-bold">데이터 등급 이관</p>
      <div className="mb-16 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">변경 대상 데이터 등급 명</p>
        <DefaultTable
          headerList={[
            { label: '등급명', key: 'name' },
            { label: '설명', key: 'description' },
            { label: '파일 개수', key: 'usedCount' },
          ]}
          data={[prevDataLevel]}
        />

        <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
          <p>
            - 변경 대상 데이터가 아래 선택한 데이터 등급으로 일괄 이관됩니다.
          </p>
          <p>
            - 속한 파일의 개별 데이터 등급은 디렉토리 내에서 설정하실 수
            있습니다.
          </p>
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">변경할 데이터 등급 선택</p>

        <ModalTable
          data={originDataLevelList.map((element, index) => ({
            id: index + 1,
            name: element.name,
            description: element.description,
          }))}
          headerList={[
            { label: '선택', key: 'id' },
            { label: '등급명', key: 'name' },
            { label: '설명', key: 'description' },
          ]}
          onclickTableRow={clickTableRow}
        />
      </div>
    </ModalLayout>
  );
};
