import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteDataAccessLevelApi } from '../api/api';

interface UseDeleteDataLevelProps {
  organId: string;
  refetchDataAccessLevel: () => void;
  modalClose: () => void;
}

export const useDeleteDataLevel = ({
  organId,
  refetchDataAccessLevel,
  modalClose,
}: UseDeleteDataLevelProps) => {
  // 데이터 등급 삭제 query
  const { mutate: deleteDataAccessLevel } = useMutation({
    mutationFn: (dataAccessLevelName: string) =>
      deleteDataAccessLevelApi({ organId, dataAccessLevelName }),
    onSuccess: () => {
      toast('데이터 등급이 삭제되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
      refetchDataAccessLevel();
      modalClose();
    },
    onError: () => {
      toast('데이터 등급 삭제에 실패했습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    },
  });

  return { deleteDataAccessLevel };
};
