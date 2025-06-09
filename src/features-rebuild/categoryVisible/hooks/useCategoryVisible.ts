import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { changeCategoryVisibleApi } from '../api/api';
import { ChangeCategoryVisibleParams } from '../api/type';

export const useCategoryVisible = (refetchDetailInfo: () => void) => {
  // 카테고리 노출 여부 변경 query
  const { mutate: changeCategoryVisible } = useMutation({
    mutationFn: (info: ChangeCategoryVisibleParams) =>
      changeCategoryVisibleApi(info),
    onSuccess: () => {
      refetchDetailInfo();
      toast.success('카테고리 노출 여부가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
    onError: () => {
      toast.error('카테고리 노출 여부 변경 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return { changeCategoryVisible };
};
