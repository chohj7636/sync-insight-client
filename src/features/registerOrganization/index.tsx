import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postRegisterOrganization } from '@/lib/api/organizations/api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const RegisterOrganization = () => {
  const navigate = useNavigate();

  // state
  const [organName, setOrganName] = useState<string>('');
  const [organHeadName, setOrganHeadName] = useState<string>('');
  const [bizRegNo, setBizRegNo] = useState<string>('');
  const [description, setDescription] = useState<string | undefined>();

  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoFile, setLogoFile] = useState<string | null>(null); // Base64 string
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [adminName, setAdminName] = useState<string>('');
  const [adminPhone, setAdminPhone] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');

  const [bizRegNoFileName, setBizRegNoFileName] = useState<string>('');
  const [bizRegNoFile, setBizRegNoFile] = useState<string | null>(null); // Base64 string

  const [passbookCopyFileName, setPassbookCopyFileName] = useState<string>('');
  const [passbookCopyFile, setPassbookCopyFile] = useState<string | null>(null); // Base64 string

  // query
  const { mutate: registerOrganization } = useMutation({
    mutationFn: postRegisterOrganization,
    onSuccess: () => {
      toast('회원사 생성 성공', {
        duration: 2000,
        position: 'top-center',
      });
      navigate('/organizations/list');
    },
    onError: () => {
      toast('회원사 생성 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const onclickPostOrganization = () => {
    if (bizRegNoFile && passbookCopyFile) {
      registerOrganization({
        organName,
        organHeadName,
        description,
        bizRegNo,
        adminName,
        adminPhone,
        adminEmail,
        logoFile: logoFile
          ? {
              originalFileName: logoFileName,
              data: logoFile,
            }
          : null,
        bizCertFile: {
          originalFileName: bizRegNoFileName,
          data: bizRegNoFile,
        },
        passbookCopyFile: {
          originalFileName: passbookCopyFileName,
          data: passbookCopyFile,
        },
      });
    }
  };

  const handleFileToBase64 = (
    file: File,
    callback: (result: string) => void,
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        callback(reader.result.toString());
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      setLogoPreview(URL.createObjectURL(file));
      handleFileToBase64(file, (base64) => setLogoFile(base64));
    }
  };

  const handleBizRegNoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBizRegNoFileName(file.name);
      handleFileToBase64(file, (base64) => setBizRegNoFile(base64));
    }
  };

  const handlePassbookCopyFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassbookCopyFileName(file.name);
      handleFileToBase64(file, (base64) => setPassbookCopyFile(base64));
    }
  };

  return (
    <div className="flex flex-col gap-7">
      {/* 회원사 정보 입력 카드 */}
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

      {/* 회원사 계약 관련 정보 카드 */}
      <div className="flex w-full flex-col gap-4 rounded-[8px] border border-[#D0D5DD] px-7 py-5">
        <p className="text-[20px] font-bold">회원사 계약 관련 정보</p>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">담당자 기본 정보</p>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">담당자명 *</p>
            <Input
              className="h-[36px] w-[388px] rounded-sm bg-white"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">담당자 연락처 *</p>
            <Input
              className="h-[36px] w-[388px] rounded-sm bg-white"
              placeholder="숫자만 입력해주세요"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">담당자 이메일 *</p>
            <Input
              className="h-[36px] w-[388px] rounded-sm bg-white"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">정산 관련 정보</p>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">사업자등록증 *</p>
            <div className="flex flex-col">
              <div className="flex items-center gap-5">
                <label className="flex h-[28px] w-[90px] cursor-pointer items-center justify-center rounded-sm border border-[#667183] bg-[#F8F9FB] text-[14px] text-[#27303F]">
                  파일첨부
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={handleBizRegNoFileChange}
                  />
                </label>
                {bizRegNoFileName ? (
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] text-[#4C5667]">
                      {bizRegNoFileName}
                    </p>
                    <button
                      className="cursor-pointer text-[14px] text-[#4C5667]"
                      onClick={() => {
                        setBizRegNoFileName('');
                        setBizRegNoFile(null);
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
              <p className="text-[14px] text-[#98A2B2]">
                pdf, png, jpg 파일만 업로드 할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">통장사본 *</p>
            <div className="flex flex-col">
              <div className="flex items-center gap-5">
                <label className="flex h-[28px] w-[90px] cursor-pointer items-center justify-center rounded-sm border border-[#667183] bg-[#F8F9FB] text-[14px] text-[#27303F]">
                  파일첨부
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={handlePassbookCopyFileChange}
                  />
                </label>
                {passbookCopyFileName ? (
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] text-[#4C5667]">
                      {passbookCopyFileName}
                    </p>
                    <button
                      className="cursor-pointer text-[14px] text-[#4C5667]"
                      onClick={() => {
                        setPassbookCopyFileName('');
                        setPassbookCopyFile(null);
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
              <p className="text-[14px] text-[#98A2B2]">
                pdf, png, jpg 파일만 업로드 할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* button wrapper */}
      <div className="flex w-full justify-end">
        <Button
          className="h-[52px] w-[200px] cursor-pointer rounded-sm bg-[#0066C3] text-[14px] text-white hover:bg-[#00449D]"
          disabled={
            !organName ||
            !bizRegNo ||
            !adminName ||
            !adminPhone ||
            !adminEmail ||
            !bizRegNoFileName ||
            !passbookCopyFileName
          }
          onClick={onclickPostOrganization}
        >
          저장
        </Button>
      </div>
    </div>
  );
};
