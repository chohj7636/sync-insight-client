import { useState } from 'react';

const OrganizationDetailInfo = () => {
  // state
  const [selectedSubMenu, setSelectedSubMenu] = useState(0);

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

  return (
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
        <p className="text-xl font-bold">{SUBMENU[selectedSubMenu].title}</p>
        <div className="h-[1px] w-full bg-[#E4E7EB]" />
        {/* <div>body</div> */}
      </div>
    </div>
  );
};

export default OrganizationDetailInfo;
