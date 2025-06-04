import { useState } from 'react';

import useRegisterOrganQeury from '@/features-rebuild/registerOrganization/hooks/useRegisterOrganQeury';
import PageHeader from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import OrganBasicInfo from '@/widgets/registerOrgan/OrganBasicInfo';
import OrganContractInfo from '@/widgets/registerOrgan/OrganContractInfo';

const OrganizationRegisterPage = () => {
  const { registerOrganization } = useRegisterOrganQeury();

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

  return (
    <div className="w-full">
      <PageHeader title="회원사 신규 등록" />
      <div className="flex flex-col gap-7">
        <OrganBasicInfo
          organName={organName}
          setOrganName={setOrganName}
          organHeadName={organHeadName}
          setOrganHeadName={setOrganHeadName}
          bizRegNo={bizRegNo}
          setBizRegNo={setBizRegNo}
          description={description}
          setDescription={setDescription}
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
          logoFileName={logoFileName}
          setLogoFileName={setLogoFileName}
          setLogoFile={setLogoFile}
          fileToBase64={handleFileToBase64}
        />
        <OrganContractInfo
          adminName={adminName}
          setAdminName={setAdminName}
          adminPhone={adminPhone}
          setAdminPhone={setAdminPhone}
          adminEmail={adminEmail}
          setAdminEmail={setAdminEmail}
          bizRegNoFileName={bizRegNoFileName}
          setBizRegNoFileName={setBizRegNoFileName}
          setBizRegNoFile={setBizRegNoFile}
          passbookCopyFileName={passbookCopyFileName}
          setPassbookCopyFileName={setPassbookCopyFileName}
          setPassbookCopyFile={setPassbookCopyFile}
          fileToBase64={handleFileToBase64}
        />
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
    </div>
  );
};

export default OrganizationRegisterPage;
