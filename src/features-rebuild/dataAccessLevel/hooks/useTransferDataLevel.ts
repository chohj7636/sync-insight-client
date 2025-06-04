import { DataAccessLevelList } from '@/entities/dataAccessLevelList/api/type';
import useModal from '@/shared/hooks/useModal';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { patchTransferDataAccessLevelApi } from '../api/api';

interface useTransferDataLevelProps {
  organId: string;
  prevDataLevel: DataAccessLevelList;
  selectedDataLevel: string | null;
  closeModal: () => void;
  refetchDataAccessLevelList: () => void;
  refetchSyncData: () => void;
}

export const useTransferDataLevel = ({
  organId,
  prevDataLevel,
  selectedDataLevel,
  closeModal,
  refetchDataAccessLevelList,
  refetchSyncData,
}: useTransferDataLevelProps) => {
  const { modal, modalClose } = useModal();

  // 데이터 이관 query
  const { mutate: transferDataAccessLevel } = useMutation({
    mutationFn: () =>
      patchTransferDataAccessLevelApi({
        organId,
        prevLevelName:
          prevDataLevel.name === '일반' ? null : prevDataLevel.name,
        newLevelName: selectedDataLevel,
      }),
    onSuccess: () => {
      refetchDataAccessLevelList();
      modal({
        title: '변경된 데이터 등급을 즉시 동기화하시겠습니까?',
        description: '',
        status: 'info',
        info: [
          '- 즉시 동기화하지 않는 경우, 각 디렉토리 별 동기화 주기에 따라 변경된 데이터 등급이 적용됩니다.',
          '- 개별 동기화 전까지 이전에 적용된 데이터 등급으로 조회됩니다.',
        ],
        eventButton: {
          title: '확인',
          clickEvent: () => {
            // 등급 동기화 API 호출
            refetchSyncData();
          },
        },
        cancelButton: {
          title: '나중에 하기',
          clickEvent: () => {
            toast(
              '각 디렉토리 별 동기화 주기에 따라 변경된 데이터 등급이 적용됩니다.',
              {
                position: 'top-center',
                duration: 2000,
              },
            );
            closeModal(); // 데이터 등급 이관 모달 닫기
            modalClose(); // 동기화 모달 닫기
          },
        },
      });
    },
    onError: () => {
      toast('데이터 등급 이관에 실패했습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    },
  });

  return { transferDataAccessLevel };
};
