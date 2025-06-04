import React from 'react';

import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface OrganBasicInfoProps {
  organName: string;
  setOrganName: (value: string) => void;
  organHeadName: string;
  setOrganHeadName: (value: string) => void;
  bizRegNo: string;
  setBizRegNo: (value: string) => void;
  description: string | undefined;
  setDescription: (value: string) => void;
  logoPreview: string | null;
  setLogoPreview: (value: string | null) => void;
  logoFileName: string;
  setLogoFileName: (value: string) => void;
  setLogoFile: (value: string | null) => void;
  fileToBase64: (file: File, callback: (result: string) => void) => void;
}

const OrganBasicInfo = ({
  organName,
  setOrganName,
  organHeadName,
  setOrganHeadName,
  bizRegNo,
  setBizRegNo,
  description,
  setDescription,
  logoPreview,
  setLogoPreview,
  logoFileName,
  setLogoFileName,
  setLogoFile,
  fileToBase64,
}: OrganBasicInfoProps) => {
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      setLogoPreview(URL.createObjectURL(file));
      fileToBase64(file, (base64) => setLogoFile(base64));
    }
  };
  return (
    <div className="flex w-full flex-col gap-4 rounded-[8px] border border-[#D0D5DD] px-7 py-5">
      <p className="text-[20px] font-bold">회원사 정보 입력</p>
      <div className="h-[1px] w-full bg-[#E4E7EB]" />

      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">회원사 기본 정보</p>
        <div className="flex items-center gap-5">
          <p className="w-[116px] text-[15px]">회원사명 *</p>
          <Input
            className="h-[36px] w-[388px] rounded-sm bg-white"
            value={organName}
            onChange={(e) => setOrganName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-5">
          <p className="w-[116px] text-[15px]">대표자명 *</p>
          <Input
            className="h-[36px] w-[388px] rounded-sm bg-white"
            value={organHeadName}
            onChange={(e) => setOrganHeadName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-5">
          <p className="w-[116px] text-[15px]">사업자등록번호 *</p>
          <Input
            className="h-[36px] w-[388px] rounded-sm bg-white"
            placeholder="숫자 10자리를 입력해주세요"
            value={bizRegNo}
            onChange={(e) => setBizRegNo(e.target.value)}
          />
        </div>
        <div className="flex items-start gap-5">
          <p className="w-[116px] text-[15px]">메모</p>
          <Textarea
            className="h-[56px] w-[870px] rounded-sm bg-white"
            placeholder="회사설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#E4E7EB]" />
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">회원사 로고</p>
        <div className="flex">
          <p className="w-[116px] text-[15px]">로고 이미지</p>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              {/* 선택된 이미지 미리 보기 */}
              <div className="h-[60px] w-[370px] rounded-sm border border-dotted border-[#D0D5DD] bg-white">
                {logoPreview && (
                  <img
                    src={logoPreview}
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
              {logoFileName ? (
                <div className="flex items-center gap-2">
                  <p className="text-[14px] text-[#4C5667]">{logoFileName}</p>
                  <button
                    className="cursor-pointer text-[14px] text-[#4C5667]"
                    onClick={() => {
                      setLogoFileName('');
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                  >
                    X
                  </button>
                </div>
              ) : (
                <p className="text-[14px] text-[#98A2B2]">
                  이미지/파일을 업로드 해주세요.
                </p>
              )}
            </div>

            <div className="w-full rounded-sm bg-[#F8F9FB] p-3">
              <p className="text-[14px] text-[#98A2B2]">
                - 이미지형식: jpg, jpeg, png
              </p>
              <p className="text-[14px] text-[#98A2B2]">
                - 권장 이미지 파일 크기: 최소 60KB이상, 최대 1MB 이하
              </p>
              <p className="text-[14px] text-[#98A2B2]">
                - 이미지 해상도: 최소 600x200px
              </p>
              <p className="text-[14px] text-[#98A2B2]">
                - 가로형 로고 사용을 권장합니다.(600x200px)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganBasicInfo;
