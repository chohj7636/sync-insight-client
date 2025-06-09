import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';

import { useCategoryEnable } from '../hooks/useCategoryEnable';

interface CategoryUsageProps {
  isCategoryEnabled: boolean;
  organId: string;
  refetchDetailInfo: () => void;
}

const CategoryUsage = ({
  isCategoryEnabled,
  organId,
  refetchDetailInfo,
}: CategoryUsageProps) => {
  // query
  const { changeCategoryEnabled } = useCategoryEnable(refetchDetailInfo);

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-lg font-bold">카테고리 사용 여부</p>
      <div className="flex gap-5">
        <p className="text-[15px] font-medium w-[116px] h-5 flex items-center">
          카테고리 사용
        </p>
        <div className="flex flex-col gap-4">
          <div className="h-5 flex items-center gap-5">
            <div className="flex items-center gap-1">
              <div
                className="cursor-pointer flex"
                onClick={() => {
                  changeCategoryEnabled({
                    organId,
                    isCategoryEnabled: true,
                  });
                }}
              >
                <img
                  src={isCategoryEnabled ? ActiveRadioIcon : InactiveRadioIcon}
                  alt=""
                />
              </div>
              <p className="text-[15px] font-medium">활성화</p>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="cursor-pointer flex"
                onClick={() => {
                  changeCategoryEnabled({
                    organId,
                    isCategoryEnabled: false,
                  });
                }}
              >
                <img
                  src={isCategoryEnabled ? InactiveRadioIcon : ActiveRadioIcon}
                  alt=""
                />
              </div>
              <p className="text-[15px] font-medium">비활성화</p>
            </div>
          </div>
          <p className="text-sm text-[#4C5667]">
            카테고리를 메타데이터로 설정해 프롬프트를 강화합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryUsage;
