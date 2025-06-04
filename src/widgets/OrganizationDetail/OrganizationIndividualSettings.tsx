import { OrganizationDetailResponse } from '@/entities/organizationDetail/api/type';
import useChangeOrganInfo from '@/features-rebuild/changeOrgainInfo/hooks/useChangeOrganInfo';
import DataAccessLevelConfig from '@/features/organization/detail/DataAccessLevelConfig';
import { Input } from '@/shared/components/ui/input';

interface OrganizationIndividualSettingsProps {
  organId: string;
  organDetailData: OrganizationDetailResponse;
  refetchOrganDetail: () => void;
}

const OrganizationIndividualSettings = ({
  organId,
  organDetailData,
  refetchOrganDetail,
}: OrganizationIndividualSettingsProps) => {
  // 회원사 로고 변경 query
  const { changeOrganLogo } = useChangeOrganInfo({
    organId: organId as string,
    refetchOrganDetail,
  });

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      changeOrganLogo(e.target.files[0]);
    }
  };

  return (
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
                {organDetailData.logo && (
                  <img
                    src={organDetailData.logo.fileDownloadUrl}
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
              {organDetailData.logo ? (
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
  );
};

export default OrganizationIndividualSettings;
