import { useEffect, useState } from 'react';

import { connectDirectoryApi } from '@/features-rebuild/categoryItemManage/api/api';
import { ConnectDirectoryParams } from '@/features-rebuild/categoryItemManage/api/type';
import { CategoryTreeNode } from '@/shared/components/CatetoryTreeNode';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { useChangeCategoryModal } from '@/shared/hooks/modals/useChangeCategoryModal';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const ChangeCategoryModal = () => {
  // zustand
  const {
    isOpen,
    organId,
    targetDirList,
    categoryList,
    categoryId,
    categoryBreadcrumb,
    refetch,
    setIsOpen,
    resetChangeCategoryModal,
  } = useChangeCategoryModal();

  useEffect(() => {
    return () => resetChangeCategoryModal();
  }, [resetChangeCategoryModal]);

  // state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryId ?? '',
  );
  const [selectedCategoryBreadcrumb, setSelectedCategoryBreadcrumb] =
    useState<string>(categoryBreadcrumb ?? '');

  // 카테고리 변경 query
  const { mutate: postChangeCategory } = useMutation({
    mutationFn: (info: ConnectDirectoryParams) => connectDirectoryApi(info),
    onSuccess: () => {
      setIsOpen(false);
      refetch();
      toast.success('카테고리가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
    onError: () => {
      toast.error('카테고리 변경 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const clickCategory = (
    _: string,
    selectedId: string,
    selectedBreadcrumb?: string,
  ) => {
    setSelectedCategoryId(selectedId);
    setSelectedCategoryBreadcrumb(selectedBreadcrumb ?? '');
  };

  const confirmButton = () => {
    postChangeCategory({
      directoryIds: targetDirList.map((dir) => dir.id),
      categoryId: selectedCategoryId,
      organId,
    });
  };

  if (!isOpen) {
    return null;
  }
  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={() => setIsOpen(false)}
      clickConfirmButton={confirmButton}
    >
      <div className="flex flex-col gap-5 w-full mb-9">
        <p className="text-2xl font-bold">카테고리 변경</p>
        <div className="flex flex-col gap-4 w-full">
          <p className="text-lg font-bold">변경 대상 디렉토리</p>
          <DefaultTable
            headerList={[
              { label: '디렉토리명', key: 'dirName' },
              { label: '기존 카테고리', key: 'categoryBreadcrumb' },
            ]}
            headerStyle="[&_th]:h-7"
            bodyStyle="h-7 [&_td]:py-0"
            data={targetDirList}
          />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <p className="text-lg font-bold">카테고리 목록</p>
          <div className="w-full p-4 border border-[#D0D5DD] rounded-sm">
            {categoryList.map((category) => (
              <CategoryTreeNode
                readonly
                key={category.id}
                node={category}
                selectedId={selectedCategoryId}
                onSelect={clickCategory}
              />
            ))}
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex flex-col gap-4 w-full">
          <p className="text-lg font-bold">선택된 카테고리</p>
          <div className="w-full h-9 flex items-center rounded-sm border border-[#D0D5DD] px-3 text-[15px]">
            <p>{selectedCategoryBreadcrumb}</p>
          </div>
          <div className="w-full p-3 bg-[#F8F9FB] text-sm text-[#98A2B2]">
            <p>- 선택한 카테고리로 지정됩니다.</p>
            <p>- 벡터 DB 동기화 작업에 시간이 소요됩니다.</p>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ChangeCategoryModal;
