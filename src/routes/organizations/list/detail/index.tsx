import { useState } from 'react';
import { useParams } from 'react-router-dom';

import ModalLayout from '@/components/ModalLayout';
import PageHeader from '@/components/PageHeader';
import PageSkeleton from '@/components/Skeleton/PageSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CategoryConfig from '@/features/organization/detail/CategoryConfig';
import DataAccessLevelConfig from '@/features/organization/detail/DataAccessLevelConfig';
import {
  getOrganizationDetailApi,
  postChangeOrganLogo,
  putChangeOrganizationInfo,
} from '@/lib/api/organizations/api';
import { GetOrganizationDetailResponse } from '@/lib/api/organizations/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const OrganizationDetailPage = () => {
  const { organId } = useParams<{ organId: string }>();

  // state
  const [selectedSubMenu, setSelectedSubMenu] = useState(0);
  const [openChangeOrganInfoModal, setOpenChangeOrganInfoModal] =
    useState(false);

  // 회원사 상세 조회 query
  const {
    data: organDetailData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['organizations', organId],
    queryFn: () => getOrganizationDetailApi({ organId: organId as string }),
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
    refetchOnMount: false,
  });

  // 회원사 로고 변경 query
  const { mutate: changeOrganLogo } = useMutation({
    mutationFn: (file: File) =>
      postChangeOrganLogo({
        organId: organId as string,
        file,
      }),
    onSuccess: () => {
      toast('회원사 로고가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetch();
    },
  });

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      changeOrganLogo(e.target.files[0]);
    }
  };

  const SUBMENU = [
    {
      id: 0,
      title: '서비스 기본 정보',
    },
    {
      id: 1,
      title: '유저 관리',
    },
    {
      id: 2,
      title: '디렉토리 관리',
    },
    {
      id: 3,
      title: 'RDB 연계 관리',
    },
    {
      id: 4,
      title: '정산관리',
    },
    {
      id: 5,
      title: '통계관리',
    },
  ];

  if (isLoading) {
    return <PageSkeleton />;
  }
  return (
    <div className="w-full">
      <PageHeader title={organDetailData?.organName ?? ''} />

      {openChangeOrganInfoModal && (
        <ChangeOrganInfoModal
          organInfo={organDetailData as GetOrganizationDetailResponse}
          closeModal={() => setOpenChangeOrganInfoModal(false)}
          refetchDetailInfo={() => refetch()}
        />
      )}

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-end">
          <Button
            className="h-7 rounded-sm border border-[#0066C3] bg-white px-3 text-sm text-[#0066C3]"
            onClick={() => setOpenChangeOrganInfoModal(true)}
          >
            회원사 정보 변경
          </Button>
        </div>
        <div
          id="pannel"
          className="mb-14 flex w-full flex-col gap-4 border-t border-t-[#667183] bg-[#F8F9FB] px-5 py-4"
        >
          <div className="grid w-full grid-cols-3">
            <div className="flex h-6 items-center">
              <p className="w-[160px] text-sm">회원사명</p>
              <p className="flex-1 text-lg font-bold">
                {organDetailData?.organName}
              </p>
            </div>
            <div className="flex h-6 items-center">
              <p className="w-[160px] text-sm">대표자명</p>
              <p className="flex-1 text-lg font-bold">
                {organDetailData?.organHeadName}
              </p>
            </div>
            <div className="flex h-6 items-center">
              <p className="w-[160px] text-sm">사업자등록번호</p>
              <p className="flex-1 text-lg font-bold">
                {organDetailData?.bizRegNo}
              </p>
            </div>
          </div>
          <div className="grid w-full grid-cols-3">
            <div className="flex h-6 items-center">
              <p className="w-[160px] text-sm">담당자명</p>
              <p className="flex-1 text-lg font-bold">
                {organDetailData?.adminName}
              </p>
            </div>
            <div className="flex h-6 items-center">
              <p className="w-[160px] text-sm">담당자 연락처</p>
              <p className="flex-1 text-lg font-bold">
                {organDetailData?.adminPhone}
              </p>
            </div>
            <div className="flex h-6 items-center">
              <p className="w-[160px] text-sm">담당자 이메일</p>
              <p className="flex-1 text-lg font-bold">
                {organDetailData?.adminEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-7">
          <div className="flex w-full gap-2">
            {SUBMENU.map((menu) => {
              return (
                <div
                  key={menu.id}
                  className={`flex h-8 w-[160px] cursor-pointer items-center justify-center border-b-2 ${
                    selectedSubMenu === menu.id
                      ? 'border-b-[#4C5667] font-bold'
                      : 'border-b-transparent font-medium'
                  }`}
                  onClick={() => setSelectedSubMenu(menu.id)}
                >
                  <p className="text-lg">{menu.title}</p>
                </div>
              );
            })}
          </div>

          <div className="flex w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
            <p className="text-xl font-bold">
              {SUBMENU[selectedSubMenu].title}
            </p>
            <div className="h-[1px] w-full bg-[#E4E7EB]" />
            {/* <div>body</div> */}
          </div>

          <div className="flex w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
            <p className="text-xl font-bold">회원사 개별 설정</p>

            <div className="h-[1px] w-full bg-[#E4E7EB]" />

            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">회원사 로고</p>
              <div className="flex">
                <p className="w-[116px] text-[15px]">로고 이미지</p>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-5">
                    {/* 선택된 이미지 미리 보기 */}
                    <div className="h-[60px] w-[370px] rounded-sm border border-dotted border-[#D0D5DD] bg-white">
                      {organDetailData?.logo && (
                        <img
                          src={organDetailData?.logo.fileDownloadUrl}
                          alt="Logo Preview"
                          className="h-full w-full rounded-sm object-cover"
                        />
                      )}
                    </div>
                    <label className="flex h-[28px] w-[90px] cursor-pointer items-center justify-center rounded-sm border border-[#667183] bg-[#F8F9FB] text-[14px] text-[#27303F]">
                      파일첨부
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleLogoFileChange}
                      />
                    </label>
                    {organDetailData?.logo ? (
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] text-[#4C5667]">
                          {organDetailData.logo.originalFileName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[14px] text-[#98A2B2]">
                        이미지/파일을 업로드 해주세요.
                      </p>
                    )}
                  </div>

                  <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-[14px] text-[#98A2B2]">
                    <p>- 이미지형식: jpg, jpeg, png</p>
                    <p>- 권장 이미지 파일 크기: 최소 60KB이상, 최대 1MB 이하</p>
                    <p>- 이미지 해상도: 최소 600x200px</p>
                    <p>- 가로형 로고 사용을 권장합니다.(600x200px)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#E4E7EB]" />

            <DataAccessLevelConfig organId={organId as string} />
          </div>

          <CategoryConfig
            organId={organId ?? ''}
            isCategoryEnabled={organDetailData?.isCategoryEnabled ?? false}
            isCategoryVisible={organDetailData?.isCategoryVisible ?? false}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailPage;

interface ChangeOrganInfoModalProps {
  organInfo: GetOrganizationDetailResponse;
  closeModal: () => void;
  refetchDetailInfo: () => void;
}

const ChangeOrganInfoModal = ({
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
      putChangeOrganizationInfo({
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
