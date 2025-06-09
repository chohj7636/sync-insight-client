import useModal from '@/shared/hooks/useModal';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteCategoryApi, postCategoryListUpdateApi } from '../api/api';
import {
  DeleteCategoryParams,
  PostCategoryListUpdateParams,
} from '../api/type';

interface AddCategoryInfo {
  name: string;
  id: string;
}

interface UseCategoryManageProps {
  setAddCategoryInfo: (info: AddCategoryInfo) => void;
  refetchCategoryList: () => void;
}

export const useCategoryManage = ({
  setAddCategoryInfo,
  refetchCategoryList,
}: UseCategoryManageProps) => {
  const { modalClose } = useModal();

  // 카테고리 리스트 업데이트 query
  const { mutate: postCategoryListUpdate } = useMutation({
    mutationFn: (info: PostCategoryListUpdateParams) =>
      postCategoryListUpdateApi(info),
    onSuccess: () => {
      refetchCategoryList();
      setAddCategoryInfo({ name: '', id: '' });
    },
    onError: () => {
      toast.error('카테고리 리스트 업데이트 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 카테고리 삭제 query
  const { mutate: deleteCategory } = useMutation({
    mutationFn: (info: DeleteCategoryParams) => deleteCategoryApi(info),
    onSuccess: () => {
      refetchCategoryList();
      modalClose();
    },
    onError: () => {
      toast.error('카테고리 삭제 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return { postCategoryListUpdate, deleteCategory };
};
