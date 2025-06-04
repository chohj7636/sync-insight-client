import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postAddDataAccessLevelApi } from '../api/api';
import { AddDataAccessLevelList } from '../api/type';

interface useAddDataLevelProps {
  organId: string;
  closeModal: () => void;
  refetchDataAccessLevelList: () => void;
}

export const useAddDataLevel = ({
  organId,
  closeModal,
  refetchDataAccessLevelList,
}: useAddDataLevelProps) => {
  // 데이터 등급 추가 query
  const { mutate: addDataAccessLevel } = useMutation({
    mutationFn: (data: AddDataAccessLevelList[]) =>
      postAddDataAccessLevelApi({
        organId,
        dataAccessLevelList: data,
      }),
    onSuccess: () => {
      toast('데이터 등급이 추가되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
      closeModal();
      refetchDataAccessLevelList();
    },
    onError: () => {
      toast('데이터 등급 추가에 실패했습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    },
  });

  return { addDataAccessLevel };
};
