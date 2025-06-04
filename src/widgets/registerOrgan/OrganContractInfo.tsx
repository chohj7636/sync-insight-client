import { Input } from '@/shared/components/ui/input';

interface OrganContractInfoProps {
  adminName: string;
  setAdminName: (value: string) => void;
  adminPhone: string;
  setAdminPhone: (value: string) => void;
  adminEmail: string;
  setAdminEmail: (value: string) => void;
  bizRegNoFileName: string;
  setBizRegNoFileName: (value: string) => void;
  setBizRegNoFile: (value: string | null) => void;
  passbookCopyFileName: string;
  setPassbookCopyFileName: (value: string) => void;
  setPassbookCopyFile: (value: string | null) => void;
  fileToBase64: (file: File, callback: (result: string) => void) => void;
}

const OrganContractInfo = ({
  adminName,
  setAdminName,
  adminPhone,
  setAdminPhone,
  adminEmail,
  setAdminEmail,
  bizRegNoFileName,
  setBizRegNoFileName,
  setBizRegNoFile,
  passbookCopyFileName,
  setPassbookCopyFileName,
  setPassbookCopyFile,
  fileToBase64,
}: OrganContractInfoProps) => {
  const handleBizRegNoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBizRegNoFileName(file.name);
      fileToBase64(file, (base64) => setBizRegNoFile(base64));
    }
  };

  const handlePassbookCopyFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassbookCopyFileName(file.name);
      fileToBase64(file, (base64) => setPassbookCopyFile(base64));
    }
  };
  return (
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
  );
};

export default OrganContractInfo;
