import { useEffect, useState } from 'react';

import { getDirectoriesList } from '@/lib/api/datasource/api';
import { DirectoryListData } from '@/lib/api/datasource/type';
import { checkKnowledgeBaseNameAvailableApi } from '@/lib/api/knowledgeBases/api';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { DefaultPagination } from '@/shared/components/Pagination';
import RegisterCardLayout from '@/shared/components/RegisterCardLayout';
import TableModal from '@/shared/components/TableModal';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import useCreateKnowledgeBaseStore from '@/shared/hooks/useCreateKnowledgeBaseStore';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

const KnowledgeBasesInfo = () => {
  // zustand state
  const {
    checkServiceName,
    setCheckServiceName,
    organInfo,
    setOrganInfo,
    knowledgeName,
    setKnowledgeName,
    knowledgeDescription,
    setKnowledgeDescription,
    setDataSources,
    dataSourcesList,
    setDataSourcesList,
    selectedDataSource,
    setSelectedDataSource,
  } = useCreateKnowledgeBaseStore();
  // state
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openSearchDirModal, setOpenSearchDirModal] = useState(false);

  const HEADERLIST = [
    {
      label: '번호',
      key: 'index',
    },
    {
      label: '회원사명',
      key: 'organName',
    },
    {
      label: '데이터소스명',
      key: 'dataSourceName',
    },
    {
      label: '타입',
      key: 'type',
      render: (value: string) => {
        return value === 'DIRECTORY' ? '디렉토리' : 'RDB';
      },
    },
    {
      label: '생성일',
      key: 'createAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
    {
      label: '생성자',
      key: 'createBy',
    },
    {
      label: '태그',
      key: 'tags',
      render: (_: string, dataItem: Record<string, string>) => {
        return (
          <Input
            className="h-[28px] rounded-sm bg-white text-[13px] placeholder:text-[13px] placeholder:text-[#98A2B2]"
            value={
              dataSourcesList.find((item) => item.id === dataItem.id)?.tags
            }
            onChange={(e) => {
              setDataSourcesList(
                dataSourcesList.map((item) =>
                  item.id === dataItem.id
                    ? { ...item, tags: e.target.value.split(',') }
                    : item,
                ),
              );
            }}
            placeholder=", 콤마 로 구분하여 입력해주세요."
          />
        );
      },
    },
    {
      label: '관리',
      key: 'id',
      render: (_: string, dataItem: Record<string, string>) => {
        return (
          <Button
            className="h-[20px] rounded-sm border border-[#E60020] px-2 text-[14px] font-normal text-[#E60020]"
            onClick={() => {
              setSelectedDataSource(
                selectedDataSource.filter((item) => item.dirId !== dataItem.id),
              );
            }}
          >
            삭제
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    setDataSourcesList(
      selectedDataSource.map((item, index) => {
        // 기존 dataSourcesList에서 같은 id를 가진 항목 찾기
        const existingItem = dataSourcesList.find(
          (source) => source.id === item.dirId,
        );

        return {
          index,
          organName: item.organName,
          dataSourceName: item.dirName,
          type: item.type as 'RELATIONAL_DATABASE' | 'DIRECTORY',
          createAt: item.createdAt,
          createBy: item.createdBy,
          // 기존 태그가 있으면 유지하고, 없으면 빈 배열 사용
          tags: existingItem?.tags || [],
          id: item.dirId,
        };
      }),
    );
  }, [selectedDataSource]);

  // 유효성 검사 query
  const { data: knowledgeBaseNameAvailable, refetch } = useQuery({
    queryKey: ['knowledgeBaseNameAvailable'],
    queryFn: () =>
      checkKnowledgeBaseNameAvailableApi({
        organId: organInfo.organId,
        knowledgeName,
      }),
    enabled: false,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => data.payload,
  });

  // 유효성 검사에 따른 toast 출력 로직
  const handleDuplicateCheck = async () => {
    if (!knowledgeName) {
      toast('지식베이스명을 입력해주세요.', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    const result = await refetch();
    const isAvailable = result.data;

    toast(
      isAvailable ? (
        '사용 가능한 지식베이스명입니다.'
      ) : (
        <>
          이미 등록된 이름입니다.
          <br />
          다른 이름을 입력해주세요.
        </>
      ),
      {
        duration: 2000,
        position: 'top-center',
      },
    );
  };

  useEffect(() => {
    if (knowledgeBaseNameAvailable !== undefined) {
      setCheckServiceName(knowledgeBaseNameAvailable);
    }
  }, [knowledgeBaseNameAvailable, setCheckServiceName]);

  const getSelectedDataSource = (data: DirectoryListData[]) => {
    setSelectedDataSource(data);
    setOpenSearchDirModal(false);
  };

  // 데이터 소스 테이블 데이터를 zustand state에 리빌딩
  useEffect(() => {
    if (dataSourcesList.length > 0) {
      setDataSources(
        dataSourcesList.map((item) => ({
          directoryId: item.id,
          dataSourceType: item.type as 'RELATIONAL_DATABASE' | 'DIRECTORY',
          dataSourceTags: item.tags,
        })),
      );
    } else setDataSources([]);
  }, [dataSourcesList]);

  return (
    <div className="flex w-full flex-col gap-7">
      {openSearchModal && (
        <TableModal
          type="organization"
          title="회원사 찾기"
          clickConfirm={(organId, organName) => {
            setOrganInfo({
              organId: organId,
              organName: organName,
            });
          }}
          closeModal={() => setOpenSearchModal(false)}
        />
      )}
      <RegisterCardLayout title="지식베이스 설정">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">지식베이스 기본 설정</p>

          <div className="flex items-center gap-5 pb-5">
            <p className="w-[116px] text-[15px]">회원사 *</p>
            <div className="flex gap-2">
              <Input
                className="h-[36px] w-[388px] rounded-sm bg-white"
                disabled
                value={organInfo.organName}
              />
              <Button
                className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-[14px] font-normal text-white"
                onClick={() => setOpenSearchModal(true)}
              >
                찾아보기
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">지식베이스명 *</p>
            <div className="flex gap-2">
              <Input
                className="h-[36px] w-[388px] rounded-sm bg-white"
                value={knowledgeName}
                disabled={!organInfo.organId}
                onChange={(e) => setKnowledgeName(e.target.value)}
              />
              <Button
                className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-[14px] font-normal text-white"
                disabled={!organInfo.organId}
                onClick={handleDuplicateCheck}
              >
                중복확인
              </Button>
              {checkServiceName && (
                <div className="flex h-[36px] w-[80px] items-center justify-center rounded-sm bg-[#E4E7EB] text-[14px] text-[#3F4959]">
                  확인완료
                </div>
              )}
            </div>
          </div>

          <div className="w-full pl-[136px]">
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3">
              <p className="text-[14px] text-[#98A2B2]">
                - 고유한 지식베이스명을 입력해주세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">지식베이스 설명</p>
            <Textarea
              className="h-[56px] w-[874px] rounded-sm bg-white"
              value={knowledgeDescription ?? ''}
              onChange={(e) => setKnowledgeDescription(e.target.value)}
            />
          </div>
        </div>
      </RegisterCardLayout>

      <RegisterCardLayout title="데이터 소스 설정">
        <div className="flex w-full flex-col gap-4">
          <p className="text-lg font-bold">데이터 소스 불러오기</p>
          <div className="flex items-center gap-4">
            <p className="w-[116px] text-[15px] font-medium">
              데이터 소스 검색
            </p>
            <div id="button-wrap" className="flex items-center gap-1">
              <Button
                className="h-[28px] bg-[#667183] px-3 text-[14px] font-normal text-white"
                onClick={() => {
                  if (organInfo.organId) {
                    setOpenSearchDirModal(true);
                  } else {
                    toast('회원사를 선택해주세요.', {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }
                }}
              >
                + 디렉토리 추가
              </Button>
              <Button className="h-[28px] bg-[#667183] px-3 text-[14px] font-normal text-white">
                + RDB 데이터베이스 추가
              </Button>
              <p className="text-[14px] text-[#4C5667]">
                건너뛰기 후 다음에 선택하실 수 있습니다.
              </p>
            </div>
          </div>

          <p className="text-lg font-bold">선택된 데이터 소스</p>

          {/* 테이블 영역 */}
          <div className="flex w-full flex-col gap-2">
            <DefaultTable data={dataSourcesList} headerList={HEADERLIST} />
          </div>
        </div>
      </RegisterCardLayout>

      {/* modal */}
      {openSearchDirModal && (
        <SearchDirModal
          title="디렉토리 찾기"
          selectedOrgaId={organInfo.organId}
          type="DIRECTORY"
          selectedDataSource={selectedDataSource}
          closeModal={() => setOpenSearchDirModal(false)}
          clickConfirmButton={getSelectedDataSource}
        />
      )}
    </div>
  );
};

export default KnowledgeBasesInfo;

interface SearchDirModalProps {
  title: string;
  selectedOrgaId: string;
  type: 'CATEGORY' | 'DIRECTORY';
  selectedDataSource: DirectoryListData[];
  closeModal: () => void;
  clickConfirmButton: (data: DirectoryListData[]) => void;
}

export const SearchDirModal = ({
  title,
  selectedOrgaId,
  type,
  selectedDataSource,
  closeModal,
  clickConfirmButton,
}: SearchDirModalProps) => {
  // state
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState(0);

  const [originSelectedData, setOriginSelectedData] = useState<
    DirectoryListData[]
  >(() => selectedDataSource);

  // 디렉토리 목록 조회 query
  const { data: directoryList, refetch } = useQuery({
    queryKey: ['searchDirectoryList'],
    queryFn: () => {
      const params = {
        organId: selectedOrgaId,
        size: 10,
        page,
        isCategorized: type === 'CATEGORY' ? false : undefined,
      };
      return getDirectoriesList(params);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  const HEADERLIST = [
    {
      label: '선택',
      key: 'id',
      render: (
        _: string,
        dataItem: Record<string, any> | DirectoryListData,
      ) => (
        <Checkbox
          checked={originSelectedData?.some(
            (file) => file.dirId === dataItem['dirId'],
          )}
          onCheckedChange={(checked) => {
            setOriginSelectedData((prev) => {
              if (checked) {
                return [
                  ...prev,
                  { ...(dataItem as DirectoryListData), type: 'DIRECTORY' },
                ];
              }
              return prev.filter((item) => item.dirId !== dataItem.dirId);
            });
          }}
        />
      ),
    },
    { label: '디렉토리명', key: 'dirName' },
    {
      label: '생성일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
    },
  ];

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const clickConfirm = () => {
    clickConfirmButton(originSelectedData ?? []);
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={clickConfirm}
    >
      <p className="text-2xl font-bold">{title}</p>
      <div className="mt-6 mb-12 flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <p className="text-[15px] font-medium">선택된 디렉토리</p>
          <div className="flex h-[52px] w-full flex-wrap items-center gap-[10px] overflow-y-auto rounded-md border border-[#D0D5DD] p-3">
            {originSelectedData?.map((element) => {
              return (
                <div
                  key={element.dirId}
                  className="flex cursor-pointer items-center gap-2 rounded-sm bg-[#27303F] px-3 py-1 text-[14px] text-white"
                  onClick={() => {
                    setOriginSelectedData((prev) =>
                      prev?.filter((item) => item.dirId !== element.dirId),
                    );
                  }}
                >
                  <p>{element.dirName}</p>
                  <p>X</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-2">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-white"
              onClick={() => refetch()}
            >
              검색
            </Button>
          </div>

          <DefaultTable
            data={directoryList?.payload.content ?? []}
            headerList={HEADERLIST}
            headerStyle="[&_th]:h-[28px]"
            bodyStyle="[&_td]:py-1"
          />
          <DefaultPagination
            totalPages={directoryList?.payload.totalPages ?? 0}
            currentPage={page + 1}
            setCurrentPage={(prevPage) => {
              setPage(prevPage - 1);
            }}
          />
        </div>
      </div>
    </ModalLayout>
  );
};
