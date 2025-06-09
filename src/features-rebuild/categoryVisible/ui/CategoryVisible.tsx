import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';

import { useCategoryVisible } from '../hooks/useCategoryVisible';

interface CategoryVisibleProps {
  isCategoryVisible: boolean;
  organId: string;
  refetchDetailInfo: () => void;
}

const CategoryVisible = ({
  isCategoryVisible,
  organId,
  refetchDetailInfo,
}: CategoryVisibleProps) => {
  const { changeCategoryVisible } = useCategoryVisible(refetchDetailInfo);

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-lg font-bold">사용자 UI 카테고리 노출 여부</p>
      <div className="flex gap-5">
        <p className="text-[15px] font-medium w-[116px] h-5 flex items-center">
          카테고리 노출
        </p>
        <div className="flex flex-col gap-4">
          <div className="h-5 flex items-center gap-5">
            <div className="flex items-center gap-1">
              <div
                className="cursor-pointer flex"
                onClick={() => {
                  changeCategoryVisible({
                    organId,
                    isCategoryVisible: true,
                  });
                }}
              >
                <img
                  src={isCategoryVisible ? ActiveRadioIcon : InactiveRadioIcon}
                  alt=""
                />
              </div>
              <p className="text-[15px] font-medium">노출</p>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="cursor-pointer flex"
                onClick={() => {
                  changeCategoryVisible({
                    organId,
                    isCategoryVisible: false,
                  });
                }}
              >
                <img
                  src={isCategoryVisible ? InactiveRadioIcon : ActiveRadioIcon}
                  alt=""
                />
              </div>
              <p className="text-[15px] font-medium">미노출</p>
            </div>
          </div>
          <p className="text-sm text-[#4C5667]">
            사용자의 채팅 UI에 카테고리 선택 기능을 활성화합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryVisible;
