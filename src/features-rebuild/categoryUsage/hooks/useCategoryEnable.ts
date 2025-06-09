import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { changeCategoryEnabledApi } from '../api/api';
import { ChangeCategoryEnabledParams } from '../api/type';

export const useCategoryEnable = (refetchDetailInfo: () => void) => {
  // 카테고리 사용 여부 변경 query
  const { mutate: changeCategoryEnabled } = useMutation({
    mutationFn: (info: ChangeCategoryEnabledParams) =>
      changeCategoryEnabledApi(info),
    onSuccess: () => {
      refetchDetailInfo();
      toast.success('카테고리 사용 여부가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
    onError: () => {
      toast.error('카테고리 사용 여부 변경 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return { changeCategoryEnabled };
};
