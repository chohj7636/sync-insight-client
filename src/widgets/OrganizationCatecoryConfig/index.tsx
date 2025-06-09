import CategoryItemManage from '@/features-rebuild/categoryItemManage/ui/CategoryItemManage';
import CategoryUsage from '@/features-rebuild/categoryUsage/ui/CategoryUsage';
import CategoryVisible from '@/features-rebuild/categoryVisible/ui/CategoryVisible';
import { useChangeCategoryModal } from '@/shared/hooks/modals/useChangeCategoryModal';
import { useSearchDirectoryModal } from '@/shared/hooks/modals/useSearchDirectoryModal';

import ChangeCategoryModal from '../modal/ChangeCategoryModal';
import { SearchDirModal } from '../modal/SearchDirModal';

interface OrganizationCategoryConfigProps {
  organId: string;
  isCategoryEnabled: boolean;
  isCategoryVisible: boolean;
  refetchDetailInfo: () => void;
}

const OrganizationCategoryConfig = ({
  organId,
  isCategoryEnabled,
  isCategoryVisible,
  refetchDetailInfo,
}: OrganizationCategoryConfigProps) => {
  const { isOpen: isOpenChangeCategoryModal } = useChangeCategoryModal();
  const { isOpen: isOpenSearchDirModal } = useSearchDirectoryModal();
  // state

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
      <p className="text-xl font-bold">카테고리 설정</p>

      <div className="h-[1px] w-full bg-[#E4E7EB]" />

      <CategoryUsage
        isCategoryEnabled={isCategoryEnabled}
        organId={organId}
        refetchDetailInfo={refetchDetailInfo}
      />
      <div className="h-[1px] w-full bg-[#E4E7EB]" />
      <CategoryItemManage
        organId={organId}
        categoryEnabledState={isCategoryEnabled}
      />
      <div className="h-[1px] w-full bg-[#E4E7EB]" />
      <CategoryVisible
        isCategoryVisible={isCategoryVisible}
        organId={organId}
        refetchDetailInfo={refetchDetailInfo}
      />

      {/* modal */}
      {isOpenChangeCategoryModal && <ChangeCategoryModal />}
      {isOpenSearchDirModal && <SearchDirModal />}
    </div>
  );
};

export default OrganizationCategoryConfig;
