import { useEffect, useState } from 'react';

import EyeOffIcon from '@/assets/icons/icon-eyeOff.svg';
import EyeOnIcon from '@/assets/icons/icon-eyeOn.svg';
import { DefaultTable } from '@/components/DefaultTable';
import ModalLayout from '@/components/ModalLayout';
import { ModalTable } from '@/components/TableModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useModal from '@/hooks/useModal';
import {
  deleteDataAccessLevelApi,
  getDataAccessLevelList,
  getSyncDataApi,
  patchTransferDataAccessLevelApi,
  postAddDataAccessLevelApi,
} from '@/lib/api/organizations/api';
import {
  AddDataAccessLevelList,
  DataAccessLevelList,
} from '@/lib/api/organizations/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DataAccessLevelConfigProps {
  organId: string;
}

const DataAccessLevelConfig = ({ organId }: DataAccessLevelConfigProps) => {
  const { modal, modalClose } = useModal();
  // state
  const [openAddDataLevelModal, setOpenAddDataLevelModal] = useState(false);
  // 변경 대상 데이터등급 명
  const [transferDataLevel, setTransferDataLevel] =
    useState<DataAccessLevelList | null>(null);

  // 데이터 등급 조회 query
  const { data: dataAccessLevelList, refetch } = useQuery({
    queryKey: ['dataAccessLevelList', organId],
    queryFn: () => getDataAccessLevelList({ organId }),
    gcTime: 0, // 데이터 등급 관련 페이지에서 관련 쿼리들 조작했을때 해당 쿼리 캐시 삭제할 수 있도록 구현하면 좋을듯
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 데이터 등급 삭제 query
  const { mutate: deleteDataAccessLevel } = useMutation({
    mutationFn: (dataAccessLevelName: string) =>
      deleteDataAccessLevelApi({ organId, dataAccessLevelName }),
    onSuccess: () => {
      toast('데이터 등급이 삭제되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
      refetch();
      modalClose();
    },
    onError: () => {
      toast('데이터 등급 삭제에 실패했습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    },
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
                  // deleteDataAccessLevel(value);
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
            data={dataAccessLevelList?.payload || []}
            headerList={HEADERLIST}
          />
        </div>
      </div>

      {openAddDataLevelModal && (
        <AddDataAccessLevelModal
          organId={organId}
          dataAccessLevelList={
            dataAccessLevelList?.payload.map((data) => ({
              name: data.name,
              description: data.description,
            })) || []
          }
          closeModal={() => setOpenAddDataLevelModal(false)}
          refetchDataAccessLevelList={refetch}
        />
      )}

      {transferDataLevel && (
        <TransferDataLevelModal
          organId={organId}
          prevDataLevel={transferDataLevel}
          originDataLevelList={
            dataAccessLevelList?.payload.filter(
              (data) => data.name !== transferDataLevel.name,
            ) || []
          }
          closeModal={() => setTransferDataLevel(null)}
          refetchDataAccessLevelList={refetch}
        />
      )}
    </div>
  );
};

export default DataAccessLevelConfig;

interface AddDataAccessLevelModalProps {
  organId: string;
  dataAccessLevelList: AddDataAccessLevelList[];
  closeModal: () => void;
  refetchDataAccessLevelList: () => void;
}

const AddDataAccessLevelModal = ({
  organId,
  dataAccessLevelList,
  closeModal,
  refetchDataAccessLevelList,
}: AddDataAccessLevelModalProps) => {
  // state
  const [selectDataLevel, setSelectDataLevel] = useState(
    dataAccessLevelList.length - 1,
  );
  // 데이터등급명, 등급설명 input
  const [addDataLevelName, setAddDataLevelName] = useState('');
  const [addDataLevelDescription, setAddDataLevelDescription] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [previewDataAccessLevelList, setPreviewDataAccessLevelList] =
    useState<AddDataAccessLevelList[]>(dataAccessLevelList);

  // 데이터 등급 추가 query
  const { mutate: addDataAccessLevel } = useMutation({
    mutationFn: (data: AddDataAccessLevelList[]) =>
      postAddDataAccessLevelApi({
        organId,
        dataAccessLevelList: data,
      }),
    onSuccess: () => {
      toast('데이터 등급이 추가되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
      closeModal();
      refetchDataAccessLevelList();
    },
    onError: () => {
      toast('데이터 등급 추가에 실패했습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    },
  });

  const confirmChangeDataAccessLevel = () => {
    const newDataLevel: AddDataAccessLevelList = {
      name: addDataLevelName,
      description: addDataLevelDescription,
    };

    // 원본 배열 가지고와서 마지막 요소인 '일반' 인덱스를 삭제후 리빌딩
    const rebuildData = dataAccessLevelList.splice(
      0,
      dataAccessLevelList.length - 1,
    );
    rebuildData.splice(selectDataLevel, -1, newDataLevel);

    addDataAccessLevel(rebuildData);
  };

  const openPreview = () => {
    if (!isPreview) {
      const newDataLevel: (typeof previewDataAccessLevelList)[number] = {
        name: addDataLevelName,
        description: addDataLevelDescription,
      };

      const rebuildData = [...dataAccessLevelList];
      rebuildData.splice(selectDataLevel, -1, newDataLevel);

      setPreviewDataAccessLevelList(rebuildData);
    }

    setIsPreview((prev) => !prev);
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={confirmChangeDataAccessLevel}
    >
      <p className="mb-6 text-2xl font-bold">데이터 등급 추가</p>
      <div className="mb-16 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">기존 데이터 등급 목록</p>
        <DefaultTable
          data={dataAccessLevelList}
          headerList={[
            { label: '등급명', key: 'name' },
            { label: '설명', key: 'description' },
          ]}
          selectedRow={selectDataLevel}
          onclickTableRow={(_, index) => {
            setIsPreview(false);
            setSelectDataLevel(index);
          }}
        />

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex w-full items-center justify-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-[#E4E7EB] bg-[#F6F7FA] text-[#667183]">
            +
          </div>
          <p className="text-[15px]">선택항목 위에 데이터 등급이 추가됩니다.</p>
        </div>

        <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
          <p>- 상위 데이터 등급은 하위 데이터 등급을 모두 포함합니다.</p>
          <p>
            - ‘일반' 등급은 기본 설정된 최하위 등급으로 수정 및 삭제하실 수
            없습니다.
          </p>
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">데이터 등급 추가</p>

        <div className="flex w-full">
          <p className="flex h-9 w-[100px] items-center text-[15px] font-medium">
            데이터 등급명*
          </p>
          <div className="flex flex-1 flex-col gap-6">
            <Input
              className="h-9 w-full"
              value={addDataLevelName}
              onChange={(e) => {
                setAddDataLevelName(e.target.value);
                setIsPreview(false);
              }}
            />
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
              <p>- 고유한 데이터 등급명을 입력해주세요.</p>
              <p>- 한글, 영문 소문자, 숫자 입력 가능합니다.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <p className="flex h-9 w-[100px] items-center text-[15px] font-medium">
            등급 설명
          </p>
          <Textarea
            className="h-14 flex-1"
            value={addDataLevelDescription}
            onChange={(e) => {
              setAddDataLevelDescription(e.target.value);
              setIsPreview(false);
            }}
          />
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex items-center gap-4">
          <p className="text-lg font-bold">변경사항 미리 보기</p>
          <Button
            className="flex h-7 items-center gap-1 rounded-sm px-3"
            onClick={openPreview}
          >
            적용
            <img src={isPreview ? EyeOnIcon : EyeOffIcon} alt="eyeOn" />
          </Button>
        </div>

        {isPreview && (
          <DefaultTable
            data={previewDataAccessLevelList}
            headerList={[
              { label: '등급명', key: 'name' },
              { label: '설명', key: 'description' },
            ]}
            selectedRow={selectDataLevel}
          />
        )}
      </div>
    </ModalLayout>
  );
};

interface TransferDataLevelModalProps {
  organId: string;
  prevDataLevel: DataAccessLevelList;
  originDataLevelList: DataAccessLevelList[];
  closeModal: () => void;
  refetchDataAccessLevelList: () => void;
}

const TransferDataLevelModal = ({
  organId,
  prevDataLevel,
  originDataLevelList,
  closeModal,
  refetchDataAccessLevelList,
}: TransferDataLevelModalProps) => {
  const { modal, modalClose } = useModal();
  // state
  const [selectedDataLevel, setSelectedDataLevel] = useState<string | null>(
    null,
  );

  // 데이터 동기화 query
  const { refetch: refetchSyncData, isSuccess: isSyncSuccess } = useQuery({
    queryKey: ['syncData'],
    queryFn: () => getSyncDataApi({ organId }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  useEffect(() => {
    if (isSyncSuccess) {
      closeModal(); // 데이터 등급 이관 모달 닫기
      modalClose(); // 동기화 모달 닫기
      toast('데이터 동기화가 완료되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    }
  }, [isSyncSuccess, closeModal, modalClose]);

  // 데이터 이관 query
  const { mutate: transferDataAccessLevel } = useMutation({
    mutationFn: () =>
      patchTransferDataAccessLevelApi({
        organId,
        prevLevelName:
          prevDataLevel.name === '일반' ? null : prevDataLevel.name,
        newLevelName: selectedDataLevel,
      }),
    onSuccess: () => {
      refetchDataAccessLevelList();
      modal({
        title: '변경된 데이터 등급을 즉시 동기화하시겠습니까?',
        description: '',
        status: 'info',
        info: [
          '- 즉시 동기화하지 않는 경우, 각 디렉토리 별 동기화 주기에 따라 변경된 데이터 등급이 적용됩니다.',
          '- 개별 동기화 전까지 이전에 적용된 데이터 등급으로 조회됩니다.',
        ],
        eventButton: {
          title: '확인',
          clickEvent: () => {
            // 등급 동기화 API 호출
            refetchSyncData();
          },
        },
        cancelButton: {
          title: '나중에 하기',
          clickEvent: () => {
            toast(
              '각 디렉토리 별 동기화 주기에 따라 변경된 데이터 등급이 적용됩니다.',
              {
                position: 'top-center',
                duration: 2000,
              },
            );
            closeModal(); // 데이터 등급 이관 모달 닫기
            modalClose(); // 동기화 모달 닫기
          },
        },
      });
    },
    onError: () => {
      toast('데이터 등급 이관에 실패했습니다.', {
        position: 'top-center',
        duration: 2000,
      });
    },
  });

  const clickTableRow = (dataItem: Record<string, any>) => {
    if (dataItem.name === '일반') {
      setSelectedDataLevel(null);
    } else {
      setSelectedDataLevel(dataItem.name);
    }
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => {
        modal({
          title: `'${selectedDataLevel ?? '일반'}' 데이터 등급을 선택하셨습니다.`,
          description: '선택한 데이터 등급으로 변경됩니다.',
          status: 'info',
          eventButton: {
            title: '계속',
            clickEvent: () => {
              // 데이터 이관 API 호출
              transferDataAccessLevel();
            },
          },
        });
      }}
    >
      <p className="mb-6 text-2xl font-bold">데이터 등급 이관</p>
      <div className="mb-16 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">변경 대상 데이터 등급 명</p>
        <DefaultTable
          headerList={[
            { label: '등급명', key: 'name' },
            { label: '설명', key: 'description' },
            { label: '파일 개수', key: 'usedCount' },
          ]}
          data={[prevDataLevel]}
        />

        <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
          <p>
            - 변경 대상 데이터가 아래 선택한 데이터 등급으로 일괄 이관됩니다.
          </p>
          <p>
            - 속한 파일의 개별 데이터 등급은 디렉토리 내에서 설정하실 수
            있습니다.
          </p>
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">변경할 데이터 등급 선택</p>

        <ModalTable
          data={originDataLevelList.map((element, index) => ({
            id: index + 1,
            name: element.name,
            description: element.description,
          }))}
          headerList={[
            { label: '선택', key: 'id' },
            { label: '등급명', key: 'name' },
            { label: '설명', key: 'description' },
          ]}
          onclickTableRow={clickTableRow}
        />
      </div>
    </ModalLayout>
  );
};
