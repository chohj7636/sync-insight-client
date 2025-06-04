import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { OrganizationDetailResponse } from '@/entities/organizationDetail/api/type';
import { useGetOrganDetailInfo } from '@/entities/organizationDetail/hooks/useGetOrganDetailInfo';
import CategoryConfig from '@/features/organization/detail/CategoryConfig';
import PageHeader from '@/shared/components/PageHeader';
import PageSkeleton from '@/shared/components/Skeleton/PageSkeleton';
import { Button } from '@/shared/components/ui/button';
import { ChangeOrganInfoModal } from '@/widgets/ChangeOrganInfoModal/ChangeOrganInfoModal';
import OrganizationDetailInfo from '@/widgets/OrganizationDetail/OrganizationDetailInfo';
import OrganizationDetailPanel from '@/widgets/OrganizationDetail/OrganizationDetailPanel';
import OrganizationIndividualSettings from '@/widgets/OrganizationDetail/OrganizationIndividualSettings';

const OrganizationDetailPage = () => {
  const { organId } = useParams<{ organId: string }>();

  // state
  const [openChangeOrganInfoModal, setOpenChangeOrganInfoModal] =
    useState(false);

  // 회원사 상세 조회 query
  const { organDetailData, isLoadingOrganDetail, refetchOrganDetail } =
    useGetOrganDetailInfo(organId as string);

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
          <OrganizationDetailInfo />

          <OrganizationIndividualSettings
            organId={organId ?? ''}
            organDetailData={organDetailData as OrganizationDetailResponse}
            refetchOrganDetail={() => refetchOrganDetail()}
          />

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
