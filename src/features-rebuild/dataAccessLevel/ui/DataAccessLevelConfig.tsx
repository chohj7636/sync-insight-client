import { DataAccessLevelList } from '@/entities/dataAccessLevelList/api/type';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { Button } from '@/shared/components/ui/button';
import useModal from '@/shared/hooks/useModal';

import { useDeleteDataLevel } from '../hooks/useDeleteDataLevel';

interface DataAccessLevelConfigProps {
  organId: string;
  dataAccessLevelList: DataAccessLevelList[];
  setOpenAddDataLevelModal: (open: boolean) => void;
  setTransferDataLevel: (dataItem: DataAccessLevelList) => void;
  refetchDataAccessLevelList: () => void;
}

const DataAccessLevelConfig = ({
  organId,
  dataAccessLevelList,
  setOpenAddDataLevelModal,
  setTransferDataLevel,
  refetchDataAccessLevelList,
}: DataAccessLevelConfigProps) => {
  const { modal, modalClose } = useModal();

  // 데이터 등급 삭제 query
  const { deleteDataAccessLevel } = useDeleteDataLevel({
    organId,
    refetchDataAccessLevel: refetchDataAccessLevelList,
    modalClose,
  });

  const clickDeleteButton = (dataItem: Record<string, any>) => {
    if ((dataItem.usedCount as number) > 0) {
      modal({
        title: '해당 데이터 등급으로 지정된 파일이 있습니다.',
        description:
          '파일을 모두 이관 후 데이터 등급을 삭제하실 수 있습니다.\n 데이터 등급을 이관하시겠습니까?',
        status: 'info',
        eventButton: {
          title: '계속',
          clickEvent: () => {
            setTransferDataLevel(dataItem as DataAccessLevelList);
            modalClose();
          },
        },
      });
    } else {
      modal({
        title: '데이터 등급 삭제 시 복구하실 수 없습니다.',
        description: '그래도 계속 하시겠습니까?',
        status: 'info',
        eventButton: {
          title: '계속',
          clickEvent: () => {
            deleteDataAccessLevel(dataItem.name);
          },
        },
      });
    }
  };

  const HEADERLIST = [
    {
      label: '등급명',
      key: 'name',
    },
    { label: '설명', key: 'description' },
    {
      label: '파일 개수',
      key: 'usedCount',
      render: (value: string) => `${value}개`,
    },
    {
      label: '관리',
      key: 'manage',
      //   style: 'w-[120px]',
      children: [
        {
          key: 'name',
          style: 'w-20',
          render: (_: string, dataItem: Record<string, any>) => (
            <Button
              className="h-5 border-[#0066c3] px-2 text-sm text-[#0066c3]"
              onClick={() => {
                setTransferDataLevel(dataItem as DataAccessLevelList);
              }}
            >
              이관
            </Button>
          ),
        },
        {
          key: 'name',
          style: 'w-20',
          render: (
            value: string,
            dataItem: Record<string, string | number>,
          ) => {
            if (value === '일반') {
              return '';
            }
            return (
              <Button
                className="h-5 border-[#E60020] px-2 text-sm text-[#E60020]"
                onClick={() => {
                  clickDeleteButton(dataItem);
                }}
              >
                삭제
              </Button>
            );
          },
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold">데이터 등급 관리</p>
      <div className="flex w-full gap-5">
        <p className="flex h-7 w-[115px] items-center text-[15px] font-medium">
          데이터 등급 관리
        </p>
        <div className="flex w-full flex-1 flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button
              className="h-7 rounded-sm bg-[#667183] px-3 text-sm text-white"
              onClick={() => setOpenAddDataLevelModal(true)}
            >
              데이터 등급 추가
            </Button>
            <p className="text-sm text-[#4C5667]">
              파일 별 데이터 등급 적용 및 사용자 별 데이터 접근 권한 설정에
              사용됩니다. 변경 시 데이터에 영향을 미칩니다.
            </p>
          </div>

          <DefaultTable
            headerList={HEADERLIST}
            data={dataAccessLevelList || []}
          />
        </div>
      </div>
    </div>
  );
};

export default DataAccessLevelConfig;
