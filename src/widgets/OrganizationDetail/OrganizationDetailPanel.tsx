interface OrganizationDetailPanelProps {
  organName: string;
  organHeadName: string;
  bizRegNo: string;
  adminName: string;
  adminPhone: string;
  adminEmail: string;
}

const OrganizationDetailPanel = ({
  organName,
  organHeadName,
  bizRegNo,
  adminName,
  adminPhone,
  adminEmail,
}: OrganizationDetailPanelProps) => {
  return (
    <div className="mb-14 flex w-full flex-col gap-4 border-t border-t-[#667183] bg-[#F8F9FB] px-5 py-4">
      <div className="grid w-full grid-cols-3">
        <div className="flex h-6 items-center">
          <p className="w-[160px] text-sm">회원사명</p>
          <p className="flex-1 text-lg font-bold">{organName}</p>
        </div>
        <div className="flex h-6 items-center">
          <p className="w-[160px] text-sm">대표자명</p>
          <p className="flex-1 text-lg font-bold">{organHeadName}</p>
        </div>
        <div className="flex h-6 items-center">
          <p className="w-[160px] text-sm">사업자등록번호</p>
          <p className="flex-1 text-lg font-bold">{bizRegNo}</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-3">
        <div className="flex h-6 items-center">
          <p className="w-[160px] text-sm">담당자명</p>
          <p className="flex-1 text-lg font-bold">{adminName}</p>
        </div>
        <div className="flex h-6 items-center">
          <p className="w-[160px] text-sm">담당자 연락처</p>
          <p className="flex-1 text-lg font-bold">{adminPhone}</p>
        </div>
        <div className="flex h-6 items-center">
          <p className="w-[160px] text-sm">담당자 이메일</p>
          <p className="flex-1 text-lg font-bold">{adminEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailPanel;
