import CategoryItemManage from '@/features-rebuild/categoryItemManage/ui/CategoryItemManage';
import CategoryUsage from '@/features-rebuild/categoryUsage/ui/CategoryUsage';

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
    </div>
  );
};

export default OrganizationCategoryConfig;
