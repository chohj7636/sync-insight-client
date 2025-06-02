import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DefaultTable } from '@/components/DefaultTable';
import ModalLayout from '@/components/ModalLayout';
import { SearchDirModal } from '@/features/createKnowledgeBases/knowledgeBasesInfo';
import { DirectoryListData } from '@/lib/api/datasource/type';
import {
  addDataSourceApi,
  deleteDataSourceApi,
  getDirectoryListByKnowledgeBaseApi,
  patchDataSourceTagApi,
  syncKnowledgeBaseApi,
} from '@/lib/api/knowledgeBases/api';
import { AddDataSourceParams } from '@/lib/api/knowledgeBases/type';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Textarea } from '@/shared/ui/textarea';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface VectorDBDataSourceListProps {
  id: string;
  organInfo: {
    organId: string;
    organName: string;
  };
}

const VectorDBDataSourceList = ({
  id,
  organInfo,
}: VectorDBDataSourceListProps) => {
  const navigate = useNavigate();

  // state
  const [checkedFiles, setCheckedFiles] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [openChangeTagModal, setOpenChangeTagModal] = useState(false);
  const [dataSourceInfoForChangeTag, setDataSourceInfoForChangeTag] =
    useState<ChangeTagModalProps['dataSourceInfo']>(null);
  const [openSearchDirModal, setOpenSearchDirModal] = useState(false);
  // 디렉토리 추가 모달에서 선택한 디렉토리 목록
  // const [selectedDirList, setSelectedDirList] = useState<DirectoryListData[]>(
  //   [],
  // );

  // 벡터 DB 디렉토리 목록 조회
  const { data: vectorDBDataSourceList, refetch } = useQuery({
    queryKey: ['vectorDBDataSourceList', id],
    queryFn: () => getDirectoryListByKnowledgeBaseApi({ id }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 선택한 데이터 소스 연계 해제
  const { mutate: deleteDataSource } = useMutation({
    mutationFn: (ids: number[]) => deleteDataSourceApi({ dataSourceIds: ids }),
    onSuccess: () => {
      toast('연계 해제가 성공', {
        duration: 2000,
        position: 'top-center',
      });
      refetch();
    },
    onError: () => {
      toast('연계 해제 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 지식베이스 동기화 요청
  const { mutate: syncKnowledgeBase } = useMutation({
    mutationFn: () =>
      syncKnowledgeBaseApi({
        id,
        dataSourceTags: checkedFiles,
      }),
    onSuccess: () => {
      toast('동기화 요청 성공', {
        duration: 2000,
        position: 'top-center',
      });
      refetch();
    },
    onError: () => {
      toast('동기화 요청 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 데이터 소스 추가 query
  const { mutate: addDataSource } = useMutation({
    mutationFn: (info: AddDataSourceParams) => addDataSourceApi(info),
    onSuccess: () => {
      toast('데이터 소스 추가 성공', {
        duration: 2000,
        position: 'top-center',
      });
      refetch();
      setOpenSearchDirModal(false);
    },
    onError: () => {
      toast('데이터 소스 추가 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });
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
    { label: '데이터소스명', key: 'dirName' },
    {
      label: '타입',
      key: 'dataSourceType',
      render: (value: string) =>
        value === 'RELATIONAL_DATABASE' ? 'RDB' : '디렉토리',
    },
    {
      label: '최초 연동일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      label: '최근 동기화',
      key: 'syncCompletedAt',
      render: (value: string) =>
        value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '-',
    },
    { label: '생성자', key: 'createdBy' },
    {
      label: '태그',
      key: 'dataSourceTags',
      render: (value: string | string[]) => {
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      },
    },
    {
      label: '관리',
      key: 'management',
      children: [
        {
          key: 'id',
          style: 'w-[90px]',
          render: (value: string, dataItem: Record<string, string>) => (
            <Button
              className="mx-auto h-5 border border-[#4C5667] px-2 text-sm text-[#4C5667]"
              onClick={() => {
                setOpenChangeTagModal(true);
                setDataSourceInfoForChangeTag({
                  id: Number(value),
                  name: dataItem['dirName'],
                  type: dataItem['dataSourceType'],
                  tag: dataItem['dataSourceTags'],
                });
              }}
            >
              태그수정
            </Button>
          ),
        },
        {
          key: 'id',
          style: 'w-[90px]',
          render: (value: string) => (
            <Button
              className="mx-auto h-5 border border-[#E60020] px-2 text-sm text-[#E60020]"
              onClick={() => deleteDataSource([Number(value)])}
            >
              연계해제
            </Button>
          ),
        },
        {
          key: 'dirId',
          style: 'w-[90px]',
          render: (value: string) => (
            <Button
              className="mx-auto h-5 border border-[#0066C3] px-2 text-sm text-[#0066C3]"
              onClick={() => navigate(`/datasource/detail/${value}`)}
            >
              상세보기
            </Button>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    if (allChecked) {
      setCheckedFiles(
        vectorDBDataSourceList?.payload.map((file) => file['id']) || [],
      );
    } else {
      setCheckedFiles([]);
    }
  }, [allChecked, vectorDBDataSourceList]);

  // 디렉토리 추가 모달 confirm 버튼
  const handleAddDir = (data: DirectoryListData[]) => {
    addDataSource({
      knowledgeBaseId: id,
      dataSources: data.map((item) => ({
        directoryId: item.dirId,
        dataSourceType: 'DIRECTORY',
        dataSourceTags: [],
      })),
    });
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <p className="text-xl font-bold">벡터 DB 데이터 소스 목록</p>
      <div className="flex w-full justify-end gap-2">
        <Button
          className="h-[28px] border border-[#E4E7EB] px-3"
          onClick={() => syncKnowledgeBase()}
        >
          동기화
        </Button>
        <Button
          className="h-[28px] border-none bg-[#0066C3] px-3 text-white"
          onClick={() => setOpenSearchDirModal(true)}
        >
          디렉토리 추가
        </Button>
        <Button
          className="h-[28px] border-none bg-[#E60020] px-3 text-white"
          onClick={() => deleteDataSource(checkedFiles)}
        >
          연계해제
        </Button>
      </div>

      {vectorDBDataSourceList?.payload ? (
        <DefaultTable
          headerList={HEADERLIST}
          data={vectorDBDataSourceList.payload}
          onClickAllCheckbox={() => setAllChecked((prev) => !prev)}
        />
      ) : (
        <div>데이터가 없습니다.</div>
      )}

      {/* modal */}
      {openChangeTagModal && (
        <ChangeTagModal
          title="데이터소스 태그 변경"
          dataSourceInfo={dataSourceInfoForChangeTag}
          closeModal={() => setOpenChangeTagModal(false)}
          refetchDataSourceList={refetch}
        />
      )}
      {openSearchDirModal && (
        <SearchDirModal
          title="디렉토리 찾기"
          selectedOrgaId={organInfo.organId}
          type="DIRECTORY"
          selectedDataSource={[]}
          closeModal={() => setOpenSearchDirModal(false)}
          clickConfirmButton={handleAddDir}
        />
      )}
    </div>
  );
};

export default VectorDBDataSourceList;

interface ChangeTagModalProps {
  title: string;
  dataSourceInfo: {
    id: number;
    name: string;
    type: string;
    tag: string;
  } | null;
  closeModal: () => void;
  refetchDataSourceList: () => void;
}

const ChangeTagModal = ({
  title,
  dataSourceInfo,
  closeModal,
  refetchDataSourceList,
}: ChangeTagModalProps) => {
  const HEADERLIST = [
    { label: '데이터소스명', key: 'name' },
    {
      label: '타입',
      key: 'type',
      render: (value: string) =>
        value === 'RELATIONAL_DATABASE' ? 'RDB' : '디렉토리',
    },
    {
      label: '태그',
      key: 'tag',
      render: (value: string | string[]) => {
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      },
    },
  ];

  // state
  const [newTags, setNewTags] = useState('');

  // 태그 수정 query
  const { mutate: patchDataSourceTag } = useMutation({
    mutationFn: () =>
      patchDataSourceTagApi({
        dataSourceIds: dataSourceInfo?.id || 0,
        dataSourceTags: newTags.split(',').map((tag) => tag.trim()),
      }),
    onSuccess: () => {
      toast('태그 수정 성공', {
        duration: 2000,
        position: 'top-center',
      });
      closeModal();
      refetchDataSourceList();
    },
    onError: () => {
      toast('태그 수정 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => patchDataSourceTag()}
    >
      <p className="mb-6 text-2xl font-bold">{title}</p>
      <div className="mb-12 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">변경 대상 데이터 소스명</p>
        {dataSourceInfo && (
          <DefaultTable headerList={HEADERLIST} data={[dataSourceInfo]} />
        )}
        <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-sm text-[#98A2B2]">
          <p>- 변경 대상 데이터소스에 매핑된 메타태그가 수정됩니다.</p>
          <p>- 메타태그는 검색 시 활용됩니다.</p>
        </div>
        <div className="h-[1px] w-full bg-[#E4E7EB]" />
        <p className="text-lg font-bold">변경할 태그 입력</p>
        <div className="flex">
          <p className="flex h-9 w-[100px] items-center">tag</p>
          <Textarea
            className="h-14 flex-1 placeholder:text-[#98A2B2]"
            placeholder=",로 구분하여 입력해주세요."
            onChange={(e) => setNewTags(e.target.value)}
          />
        </div>
      </div>
    </ModalLayout>
  );
};
