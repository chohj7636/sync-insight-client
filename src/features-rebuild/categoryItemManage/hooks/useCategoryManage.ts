import useModal from '@/shared/hooks/useModal';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  connectDirectoryApi,
  deleteCategoryApi,
  postCategoryListUpdateApi,
} from '../api/api';
import {
  ConnectDirectoryParams,
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
  refetchCategoryDirectoryList: () => void;
}

export const useCategoryManage = ({
  setAddCategoryInfo,
  refetchCategoryList,
  refetchCategoryDirectoryList,
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

  // 카테고리에 디렉토리 연결 query
  // const { mutate: postConnectDirectory } = useMutation({
  //   mutationFn: (info: ConnectDirectoryParams) => connectDirectoryApi(info),
  //   onSuccess: () => {
  //     toast.success('디렉토리가 연결되었습니다.', {
  //       duration: 2000,
  //       position: 'top-center',
  //     });
  //     refetchCategoryDirectoryList();
  //     refetchCategoryList();
  //     setOpenSearchDirModal(false);
  //   },
  //   onError: () => {
  //     toast.error('카테고리에 디렉토리 연결 실패', {
  //       duration: 2000,
  //       position: 'top-center',
  //     });
  //   },
  // });

  // 카테고리 해제 query
  const { mutate: disconnectCategory } = useMutation({
    mutationFn: (info: ConnectDirectoryParams) => connectDirectoryApi(info),
    onSuccess: () => {
      refetchCategoryList();
      refetchCategoryDirectoryList();
      toast.success('카테고리가 해제되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
    onError: () => {
      toast.error('카테고리 해제 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return { postCategoryListUpdate, deleteCategory, disconnectCategory };
};
