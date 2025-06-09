import { useState } from 'react';

import { AddDataAccessLevelList } from '@/features-rebuild/dataAccessLevel/api/type';
import { useAddDataLevel } from '@/features-rebuild/dataAccessLevel/hooks/useAddDataLevel';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import EyeOffIcon from '@/shared/icons/icon-eyeOff.svg';
import EyeOnIcon from '@/shared/icons/icon-eyeOn.svg';

interface AddDataAccessLevelModalProps {
  organId: string;
  dataAccessLevelList: AddDataAccessLevelList[];
  closeModal: () => void;
  refetchDataAccessLevelList: () => void;
}

export const AddDataAccessLevelModal = ({
  organId,
  dataAccessLevelList,
  closeModal,
  refetchDataAccessLevelList,
}: AddDataAccessLevelModalProps) => {
  // state
  const [selectDataLevel, setSelectDataLevel] = useState(
    dataAccessLevelList.length - 1,
  );
  // 데이터등급명, 등급설명 input
  const [addDataLevelName, setAddDataLevelName] = useState('');
  const [addDataLevelDescription, setAddDataLevelDescription] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [previewDataAccessLevelList, setPreviewDataAccessLevelList] =
    useState<AddDataAccessLevelList[]>(dataAccessLevelList);

  // 데이터 등급 추가 query
  const { addDataAccessLevel } = useAddDataLevel({
    organId,
    closeModal,
    refetchDataAccessLevelList,
  });

  const confirmChangeDataAccessLevel = () => {
    const newDataLevel: AddDataAccessLevelList = {
      name: addDataLevelName,
      description: addDataLevelDescription,
    };

    // 원본 배열 가지고와서 마지막 요소인 '일반' 인덱스를 삭제후 리빌딩
    const rebuildData = dataAccessLevelList.splice(
      0,
      dataAccessLevelList.length - 1,
    );
    rebuildData.splice(selectDataLevel, -1, newDataLevel);

    addDataAccessLevel(rebuildData);
  };

  const openPreview = () => {
    if (!isPreview) {
      const newDataLevel: (typeof previewDataAccessLevelList)[number] = {
        name: addDataLevelName,
        description: addDataLevelDescription,
      };

      const rebuildData = [...dataAccessLevelList];
      rebuildData.splice(selectDataLevel, -1, newDataLevel);

      setPreviewDataAccessLevelList(rebuildData);
    }

    setIsPreview((prev) => !prev);
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={confirmChangeDataAccessLevel}
    >
      <p className="mb-6 text-2xl font-bold">데이터 등급 추가</p>
      <div className="mb-16 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">기존 데이터 등급 목록</p>
        <DefaultTable
          data={dataAccessLevelList}
          headerList={[
            { label: '등급명', key: 'name' },
            { label: '설명', key: 'description' },
          ]}
          selectedRow={selectDataLevel}
          onclickTableRow={(_, index) => {
            setIsPreview(false);
            setSelectDataLevel(index);
          }}
        />

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex w-full items-center justify-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#E4E7EB] bg-[#F6F7FA] text-[#667183]">
            +
          </div>
          <p className="text-[15px]">선택항목 위에 데이터 등급이 추가됩니다.</p>
        </div>

        <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
          <p>- 상위 데이터 등급은 하위 데이터 등급을 모두 포함합니다.</p>
          <p>
            - ‘일반' 등급은 기본 설정된 최하위 등급으로 수정 및 삭제하실 수
            없습니다.
          </p>
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">데이터 등급 추가</p>

        <div className="flex w-full">
          <p className="flex h-9 w-[100px] items-center text-[15px] font-medium">
            데이터 등급명*
          </p>
          <div className="flex flex-1 flex-col gap-6">
            <Input
              className="h-9 w-full"
              value={addDataLevelName}
              onChange={(e) => {
                setAddDataLevelName(e.target.value);
                setIsPreview(false);
              }}
            />
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
              <p>- 고유한 데이터 등급명을 입력해주세요.</p>
              <p>- 한글, 영문 소문자, 숫자 입력 가능합니다.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <p className="flex h-9 w-[100px] items-center text-[15px] font-medium">
            등급 설명
          </p>
          <Textarea
            className="h-14 flex-1"
            value={addDataLevelDescription}
            onChange={(e) => {
              setAddDataLevelDescription(e.target.value);
              setIsPreview(false);
            }}
          />
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex items-center gap-4">
          <p className="text-lg font-bold">변경사항 미리 보기</p>
          <Button
            className="flex h-7 items-center gap-1 rounded-sm px-3"
            onClick={openPreview}
          >
            적용
            <img src={isPreview ? EyeOnIcon : EyeOffIcon} alt="eyeOn" />
          </Button>
        </div>

        {isPreview && (
          <DefaultTable
            data={previewDataAccessLevelList}
            headerList={[
              { label: '등급명', key: 'name' },
              { label: '설명', key: 'description' },
            ]}
            selectedRow={selectDataLevel}
          />
        )}
      </div>
    </ModalLayout>
  );
};
