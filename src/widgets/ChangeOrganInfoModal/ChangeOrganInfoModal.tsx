import { useState } from 'react';

import { OrganizationDetailResponse } from '@/entities/organizationDetail/api/type';
import { putChangeOrganizationInfoApi } from '@/features-rebuild/changeOrgainInfo/api/api';
import ModalLayout from '@/shared/components/ModalLayout';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ChangeOrganInfoModalProps {
  organInfo: OrganizationDetailResponse;
  closeModal: () => void;
  refetchDetailInfo: () => void;
}

export const ChangeOrganInfoModal = ({
  organInfo,
  closeModal,
  refetchDetailInfo,
}: ChangeOrganInfoModalProps) => {
  // state
  const [organHeadName, setOrganHeadName] = useState(organInfo.organHeadName);
  const [bizRegNo, setBizRegNo] = useState(organInfo.bizRegNo);
  const [adminName, setAdminName] = useState(organInfo.adminName);
  const [adminPhone, setAdminPhone] = useState(organInfo.adminPhone);
  const [adminEmail, setAdminEmail] = useState(organInfo.adminEmail);
  const [description, setDescription] = useState(organInfo.descriptioon);

  // 회원사 기본정보 변경 query
  const { mutate: changeOrganInfo } = useMutation({
    mutationFn: () =>
      putChangeOrganizationInfoApi({
        organId: organInfo.id,
        organHeadName: organHeadName ?? '',
        bizRegNo,
        adminName,
        adminEmail,
        adminPhone,
        description: description ?? '',
      }),
    onSuccess: () => {
      toast('회원사 기본정보가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      closeModal();
      refetchDetailInfo();
    },
    onError: () => {
      toast('회원사 기본정보 변경에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return (
    <ModalLayout
      modalWidth="w-[500px]"
      closeModal={closeModal}
      clickConfirmButton={() => changeOrganInfo()}
    >
      <p className="text-2xl font-bold">회원사 기본정보 변경</p>
      <div className="mt-6 mb-12 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">회원사 기본 정보</p>
        <div className="flex items-center text-[15px] font-medium">
          <p className="w-[100px]">회원사명</p>
          <p>{organInfo.organName}</p>
        </div>
        <div className="flex items-center text-[15px] font-medium">
          <p className="w-[100px]">대표자명*</p>
          <Input
            className="w-[130px]"
            value={organHeadName ?? ''}
            onChange={(e) => setOrganHeadName(e.target.value)}
          />
        </div>
        <div className="flex items-center text-[15px] font-medium">
          <p className="w-[100px]">사업자등록번호*</p>
          <Input
            className="flex-1"
            value={bizRegNo ?? ''}
            onChange={(e) => setBizRegNo(e.target.value)}
          />
        </div>
        <div className="flex text-[15px] font-medium">
          <p className="flex h-9 w-[100px] items-center">메모</p>
          <Textarea
            className="h-14 flex-1"
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">회원사 담당자 정보</p>
        <div className="flex items-center text-[15px] font-medium">
          <p className="w-[100px]">담당자명*</p>
          <Input
            className="w-[130px]"
            value={adminName ?? ''}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>
        <div className="flex items-center text-[15px] font-medium">
          <p className="w-[100px]">담당자 연락처*</p>
          <Input
            className="flex-1"
            value={adminPhone ?? ''}
            onChange={(e) => setAdminPhone(e.target.value)}
          />
        </div>
        <div className="flex items-center text-[15px] font-medium">
          <p className="w-[100px]">담당자 이메일*</p>
          <Input
            className="flex-1"
            value={adminEmail ?? ''}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </div>
      </div>
    </ModalLayout>
  );
};
