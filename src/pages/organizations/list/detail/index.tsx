import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { OrganizationDetailResponse } from '@/entities/organizationDetail/api/type';
import { useGetOrganDetailInfo } from '@/entities/organizationDetail/hooks/useGetOrganDetailInfo';
import CategoryConfig from '@/features/organization/detail/CategoryConfig';
import DataAccessLevelConfig from '@/features/organization/detail/DataAccessLevelConfig';
import { postChangeOrganLogo } from '@/lib/api/organizations/api';
import PageHeader from '@/shared/components/PageHeader';
import PageSkeleton from '@/shared/components/Skeleton/PageSkeleton';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ChangeOrganInfoModal } from '@/widgets/ChangeOrganInfoModal/ChangeOrganInfoModal';
import OrganizationDetailPanel from '@/widgets/OrganizationDetailPanel';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const OrganizationDetailPage = () => {
  const { organId } = useParams<{ organId: string }>();

  // state
  const [selectedSubMenu, setSelectedSubMenu] = useState(0);
  const [openChangeOrganInfoModal, setOpenChangeOrganInfoModal] =
    useState(false);

  // 회원사 상세 조회 query
  const { organDetailData, isLoadingOrganDetail, refetchOrganDetail } =
    useGetOrganDetailInfo(organId as string);

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
      refetchOrganDetail();
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

  if (isLoadingOrganDetail) {
    return <PageSkeleton />;
  }
  return (
    <div className="w-full">
      <PageHeader title={organDetailData?.organName ?? ''} />

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-end">
          <Button
            className="h-7 rounded-sm border border-[#0066C3] bg-white px-3 text-sm text-[#0066C3]"
            onClick={() => setOpenChangeOrganInfoModal(true)}
          >
            회원사 정보 변경
          </Button>
        </div>
        <OrganizationDetailPanel
          organName={organDetailData?.organName ?? ''}
          organHeadName={organDetailData?.organHeadName ?? ''}
          bizRegNo={organDetailData?.bizRegNo ?? ''}
          adminName={organDetailData?.adminName ?? ''}
          adminPhone={organDetailData?.adminPhone ?? ''}
          adminEmail={organDetailData?.adminEmail ?? ''}
        />
        {openChangeOrganInfoModal && (
          <ChangeOrganInfoModal
            organInfo={organDetailData as OrganizationDetailResponse}
            closeModal={() => setOpenChangeOrganInfoModal(false)}
            refetchDetailInfo={() => refetchOrganDetail()}
          />
        )}

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
