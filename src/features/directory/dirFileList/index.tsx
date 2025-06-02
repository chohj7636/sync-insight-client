import { useEffect, useRef, useState } from 'react';

import DefaultSelect from '@/components/DefaultSelect';
import { DefaultTable } from '@/components/DefaultTable';
import ModalLayout from '@/components/ModalLayout';
import { DefaultPagination } from '@/components/Pagination';
import { ModalTable } from '@/components/TableModal';
import {
  changeDataAccessLevel,
  deleteFiles,
  downloadDirectoryFile,
  searchDirectoryFiles,
  uploadDirectoryFile,
} from '@/lib/api/datasource/api';
import {
  DirectoryFileListData,
  changeDataAccessLevelParams,
} from '@/lib/api/datasource/type';
import { getDataAccessLevelList } from '@/lib/api/organizations/api';
import useModal from '@/shared/hooks/useModal';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DirectoryFileListProps {
  organId: string;
  dirId: string;
}

const DirectoryFileList = ({ organId, dirId }: DirectoryFileListProps) => {
  const { modal, modalClose } = useModal();
  // state
  const [checkedFiles, setCheckedFiles] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [openChangeDataLevelModal, setOpenChangeDataLevelModal] =
    useState(false);
  const [changeTargetFiles, setChangeTargetFiles] = useState<
    DirectoryFileListData[]
  >([]);
  // 단일 데이터 등급변경 버튼 상태
  const [openSingleDataAccessChangeModal, setOpenSingleDataAccessChangeModal] =
    useState(false);
  const [singleChangeTargetFile, setSingleChangeTargetFile] = useState<
    DirectoryFileListData[]
  >([]);

  // 파일 input ref 추가
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 목록 테이블 헤더
  const HEADERLIST = [
    {
      label: '',
      key: 'select',
      render: (_: string, dataItem: Record<string, any>) => (
        <Checkbox
          checked={checkedFiles.includes(dataItem['id'])}
          onCheckedChange={() =>
            setCheckedFiles((prev) =>
              prev.includes(dataItem['id'])
                ? prev.filter((id) => id !== dataItem['id'])
                : [...prev, dataItem['id']],
            )
          }
        />
      ),
    },
    {
      label: '파일명',
      key: 'originalFileName',
      render: (value: string) => value.split('.')[0],
    },
    { label: '타입', key: 'extension' },
    {
      label: '파일크기',
      key: 'fileSize',
      render: (value: string) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let sizeInBytes = Number(value);
        let index = 0;
        while (sizeInBytes >= 1024 && index < units.length - 1) {
          sizeInBytes /= 1024;
          index++;
        }
        return `${sizeInBytes.toFixed(1)}${units[index]}`;
      },
    },
    {
      label: '데이터 등급',
      key: 'accessLevel',
      render: (value: string) => (value ? value : '일반'),
    },
    {
      label: '최초 등록일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      label: '최근 수정일',
      key: 'updatedAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    { label: '등록자', key: 'createdBy' },
    {
      label: '관리',
      key: 'management',
      children: [
        {
          key: 'id',
          render: (value: string) => (
            <Button
              className="mx-auto h-5 w-[114px] border border-[#667183] text-[14px]"
              onClick={() => {
                setOpenChangeDataLevelModal(true);
                setOpenSingleDataAccessChangeModal(true);
                setSingleChangeTargetFile(
                  fileListData?.payload.content.filter(
                    (file) => file.id === Number(value),
                  ) || [],
                );
              }}
            >
              데이터등급변경
            </Button>
          ),
        },
        {
          key: 'savedId',
          render: (value: string, dataItem: Record<string, any>) => (
            <Button
              className="mx-auto h-5 w-[80px] border border-[#667183] text-[14px]"
              onClick={async () => {
                try {
                  const blob = await downloadDirectoryFile(value);
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', dataItem.originalFileName); // 원본 파일명으로 다운로드
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  showToast('파일 다운로드 중 오류가 발생했습니다.');
                }
              }}
            >
              다운로드
            </Button>
          ),
        },
        {
          key: 'id',
          render: (value: string) => (
            <Button
              className="mx-auto h-5 w-[52px] border border-[#E60020] text-[14px] text-[#E60020]"
              onClick={() => {
                modal({
                  title: '파일 삭제 시 벡터화된 DB도 모두 삭제됩니다.',
                  description:
                    '삭제된 후에는 복구하실 수 없습니다. 그래도 계속 하시겠습니까?',
                  status: 'info',
                  info: [
                    '- 연계된 지식베이스의 벡터화된 DB 정보가 모두 삭제됩니다.',
                    '- 동일 파일이라도 새로 등록할 경우 벡터 DB화에 비용이 발생합니다.',
                    '- 질의 시 삭제된 파일들은 검색 대상에서 영구 제외됩니다.',
                  ],
                  eventButton: {
                    title: '계속',
                    clickEvent: () => deleteFileList([Number(value)]),
                  },
                });
              }}
            >
              삭제
            </Button>
          ),
        },
      ],
    },
  ];

  // list params state
  const [page, setPage] = useState(0);
  const [searchFileName, setSearchFileName] = useState<string | undefined>();
  const [size, setSize] = useState(20);

  // file upload query
  const { mutate: uploadFile } = useMutation({
    mutationFn: (files: File[]) => uploadDirectoryFile({ dirId, files }),
    onSuccess: () => {
      refetch();
    },
  });

  // file list query
  const { data: fileListData, refetch } = useQuery({
    queryKey: ['directoryFiles', dirId],
    queryFn: () =>
      searchDirectoryFiles({
        dirId,
        originalFileName: searchFileName,
        page,
        size,
      }),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // file delete query
  const { mutate: deleteFileList } = useMutation({
    mutationFn: (ids: number[]) => deleteFiles({ id: ids }),
    onSuccess: () => {
      toast('파일 삭제가 완료되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetch();
      modalClose();
    },
    onError: () => {
      toast('파일 삭제 중 오류가 발생했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFile(Array.from(e.target.files));
      // 파일 업로드 후 input value 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (allChecked) {
      setCheckedFiles(
        fileListData?.payload.content.map((file) => file['id']) || [],
      );
    } else {
      setCheckedFiles([]);
    }
  }, [allChecked]);

  // 토스트 출력 함수
  const showToast = (message: string) => {
    toast(message, {
      duration: 2000,
      position: 'top-center',
    });
  };

  // 데이터 등급 변경 버튼 클릭시
  const clickChangeDataLevelButton = () => {
    if (!fileListData?.payload.content || checkedFiles.length === 0) {
      return;
    }

    const selectedFiles = fileListData.payload.content.filter((file) =>
      checkedFiles.includes(file.id),
    );

    setChangeTargetFiles(selectedFiles);

    // modal open
    setOpenChangeDataLevelModal(true);
  };

  useEffect(() => {
    refetch();
  }, [page, size, refetch]);

  return (
    <div className="flex w-full flex-col gap-5">
      {openChangeDataLevelModal && (
        <ChageDataLevelModal
          organId={organId}
          dirId={dirId}
          closeModal={() => {
            setOpenChangeDataLevelModal(false);
            setOpenSingleDataAccessChangeModal(false);
          }}
          changeTargetFiles={
            openSingleDataAccessChangeModal
              ? singleChangeTargetFile
              : changeTargetFiles
          }
          refetchFileList={refetch}
        />
      )}
      <div id="header" className="flex items-center gap-5">
        <p className="text-xl font-bold text-[#27303F]">디렉토리 파일 목록</p>
        <Button
          className="h-[36px]"
          onClick={() => {
            setPage(0);
            refetch();
          }}
        >
          리프레시
        </Button>
      </div>

      <div className="flex items-center gap-5">
        <p className="text-sm font-medium text-[#27303F]">
          디렉토리 내 파일 검색
        </p>
        <Input
          className="h-[36px] w-[300px]"
          onChange={(e) => setSearchFileName(e.target.value)}
        />
        <Button
          className="h-[36px]"
          onClick={() => {
            setPage(0);
            refetch();
          }}
        >
          검색
        </Button>
      </div>

      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2 [&_button]:h-[28px] [&_button]:text-[14px] [&_button]:font-normal">
            <DefaultSelect
              className="!h-[28px] py-0"
              selectList={[
                {
                  label: '20개씩',
                  value: '20',
                },
                {
                  label: '10개씩',
                  value: '10',
                },
              ]}
              defaultValue={size.toString()}
              setValue={(value) => setSize(Number(value))}
            />
            <label className="flex h-[28px] w-[100px] cursor-pointer items-center justify-center rounded-sm bg-[#0066C3] text-[14px] text-white">
              + 파일업로드
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleUploadFile}
              />
            </label>
            <Button
              className="w-[130px]"
              onClick={() => {
                if (checkedFiles.length > 0) {
                  clickChangeDataLevelButton();
                } else showToast('선택된 파일이 없습니다.');
              }}
            >
              데이터 등급 변경
            </Button>
            <Button
              className="w-[90px] bg-[#f8f9fb]"
              onClick={() => {
                if (checkedFiles.length > 0) {
                  //
                } else showToast('선택된 파일이 없습니다.');
              }}
            >
              다운로드
            </Button>
            <Button
              className="w-[90px] bg-[#e60020] text-white"
              onClick={() => {
                if (checkedFiles.length > 0) {
                  modal({
                    title: '파일 삭제 시 벡터화된 DB도 모두 삭제됩니다.',
                    description:
                      '삭제된 후에는 복구하실 수 없습니다. 그래도 계속 하시겠습니까?',
                    status: 'info',
                    info: [
                      '- 연계된 지식베이스의 벡터화된 DB 정보가 모두 삭제됩니다.',
                      '- 동일 파일이라도 새로 등록할 경우 벡터 DB화에 비용이 발생합니다.',
                      '- 질의 시 삭제된 파일들은 검색 대상에서 영구 제외됩니다.',
                    ],
                    eventButton: {
                      title: '계속',
                      clickEvent: () => deleteFileList(checkedFiles),
                    },
                  });
                } else showToast('선택된 파일이 없습니다.');
              }}
            >
              선택삭제
            </Button>
          </div>
        </div>
        {fileListData?.payload.content ? (
          <DefaultTable
            headerList={HEADERLIST}
            data={fileListData?.payload.content || []}
            onClickAllCheckbox={() => setAllChecked((prev) => !prev)}
          />
        ) : (
          <div>데이터가 없습니다.</div>
        )}

        <DefaultPagination
          totalPages={fileListData?.payload.totalPages ?? 0}
          currentPage={page + 1}
          setCurrentPage={(prevPage) => {
            setPage(prevPage - 1);
          }}
        />
      </div>
    </div>
  );
};

export default DirectoryFileList;

interface ChageDataLevelModalProps {
  organId: string;
  dirId: string;
  closeModal: () => void;
  refetchFileList: () => void;
  changeTargetFiles: DirectoryFileListData[];
}

const ChageDataLevelModal = ({
  organId,
  dirId,
  closeModal,
  refetchFileList,
  changeTargetFiles,
}: ChageDataLevelModalProps) => {
  // state
  const [selectedDataLevel, setSelectedDataLevel] = useState<string | null>(
    null,
  );

  // 데이터 등급 조회 query
  const { data: dataLevelList } = useQuery({
    queryKey: ['dataLevelList', organId],
    queryFn: () => getDataAccessLevelList({ organId }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 데이터 등급 변경 query
  const { mutate: changeDataQuery } = useMutation({
    mutationFn: (info: changeDataAccessLevelParams) =>
      changeDataAccessLevel(info),
    onSuccess: () => {
      toast('데이터 등급이 변경되었습니다.', {
        position: 'top-center',
        duration: 2000,
      });
      closeModal();
      refetchFileList();
    },
  });

  // table row click
  const clickTableRow = (dataItem: Record<string, string>) => {
    setSelectedDataLevel(dataItem.name === '일반' ? null : dataItem.name);
  };

  const clickConfirmButton = () => {
    changeDataQuery({
      ids: changeTargetFiles.map((file) => file.id),
      accessLevel: selectedDataLevel,
      dirId,
    });
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={clickConfirmButton}
    >
      <p className="text-primary mb-6 text-2xl font-bold">데이터 등급 변경</p>

      {/* body */}
      <div className="mb-12 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">변경 대상 파일</p>

        <div className="relative max-h-[300px] w-full overflow-y-auto border-t border-t-black">
          <DefaultTable
            headerList={[
              { label: '파일명', key: 'originalFileName' },
              { label: '타입', key: 'extension' },
              {
                label: '등급',
                key: 'accessLevel',
                render: (value: string) => (value ? value : '일반'),
              },
            ]}
            data={changeTargetFiles}
            headerStyle="border-t-0"
            bodyStyle="text-[12px] [&_td]:py-0 [&_td]:h-[26px]"
            isScroll
          />
        </div>
        <div className="w-full rounded-sm bg-[#F8F9FB] p-4">
          <p className="text-sm text-[#98A2B2]">
            - 변경 대상 파일이 아래 선택한 데이터 등급으로 일괄 이관됩니다.
          </p>
          <p className="text-sm text-[#98A2B2]">
            - 상위 데이터 등급은 하위 데이터 등급을 모두 포함합니다.
          </p>
        </div>

        <p className="text-lg font-bold">변경할 데이터 등급 선택</p>
        <ModalTable
          data={
            dataLevelList?.payload.map((items, index) => ({
              id: index + 1,
              name: items.name,
              description: items.description,
            })) || []
          }
          headerList={[
            { label: '선택', key: 'id' },
            { label: '데이터 등급명', key: 'name' },
            { label: '설명', key: 'description' },
          ]}
          onclickTableRow={clickTableRow}
        />
      </div>
    </ModalLayout>
  );
};
