import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ConfigCard from '@/components/ConfigCard';
import ModalLayout from '@/components/ModalLayout';
import PageHeader from '@/components/PageHeader';
import PageSkeleton from '@/components/Skeleton/PageSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ConnectedServiceList from '@/features/knowledgeBase/connectedServiceList';
import VectorDBDataSourceList from '@/features/knowledgeBase/detailDatasourceList';
import {
  checkKnowledgeBaseNameAvailableApi,
  getKnowledgeBaseDetailApi,
  updateKnowledgeBaseInfoApi,
} from '@/lib/api/knowledgeBases/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

const KnowledgeDetailPage = () => {
  const { knowledgeBaseId } = useParams<{ knowledgeBaseId: string }>();

  // state
  const [
    openChangeKnowledgeBaseInfoModal,
    setOpenChangeKnowledgeBaseInfoModal,
  ] = useState(false);

  // query
  const {
    data: knowledgeBaseDetailData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['knowledge-base-detail', knowledgeBaseId],
    queryFn: () => getKnowledgeBaseDetailApi({ id: knowledgeBaseId ?? '' }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full">
      <PageHeader
        title={`지식베이스 | ${knowledgeBaseDetailData?.payload.knowledgeName}`}
      />

      <div id="body" className="flex w-full flex-col gap-10">
        <div id="info-pannel" className="flex w-full flex-col gap-5">
          <div className="flex w-full justify-end">
            <Button
              className="h-[28px] rounded-sm border border-[#0066C3] bg-white px-3 text-sm text-[#0066C3] hover:bg-white"
              onClick={() => setOpenChangeKnowledgeBaseInfoModal(true)}
            >
              지식베이스 정보 변경
            </Button>
          </div>
          <div className="flex w-full flex-col gap-4 border-t border-t-black bg-[#F8F9FB] px-5 py-4 text-[#27303F]">
            <div className="flex items-center gap-6">
              <p className="w-[160px] text-sm">회원사명</p>
              <p className="text-lg font-bold">
                {knowledgeBaseDetailData?.payload.organization.organName}
              </p>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">지식베이스명</p>
                <p className="text-lg font-bold">
                  {knowledgeBaseDetailData?.payload.knowledgeName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p className="w-[160px] text-sm">지식베이스 설명</p>
              <p className="text-[15px]">
                {knowledgeBaseDetailData?.payload.description}
              </p>
            </div>

            <div className="h-[1px] w-full bg-[#D0D5DD]" />

            <div className="flex items-center gap-6">
              <p className="w-[160px] text-sm">생성자</p>
              <p className="text-[15px]">
                {knowledgeBaseDetailData?.payload.createdBy}
              </p>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-1/2 items-center gap-6">
                <p className="w-[160px] text-sm">최초생성일</p>
                <p className="text-[15px]">
                  {format(
                    new Date(knowledgeBaseDetailData?.payload.createdAt ?? ''),
                    'yyyy-MM-dd HH:mm:ss',
                  )}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <p className="w-[160px] text-sm">최근 수정일</p>
                <p className="text-[15px]">
                  {format(
                    new Date(knowledgeBaseDetailData?.payload.updatedAt ?? ''),
                    'yyyy-MM-dd HH:mm:ss',
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 items-stretch gap-7">
          <div className="flex h-full w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
            <p className="text-xl font-bold">임베딩 설정</p>
            <div className="h-[1px] w-full bg-[#E4E7EB]" />
            <ConfigCard
              data={[
                {
                  title: '임베딩 모델',
                  value:
                    knowledgeBaseDetailData?.payload.embedderConfig.model ?? '',
                },
                {
                  title: '임베딩 차원',
                  value:
                    knowledgeBaseDetailData?.payload.embedderConfig.dimension ??
                    '',
                },
                {
                  title: '인덱싱 방식',
                  value:
                    knowledgeBaseDetailData?.payload.indexingOptions
                      .indexingType ?? '',
                },
                {
                  title: '인덱싱 주기',
                  value:
                    knowledgeBaseDetailData?.payload.indexingOptions
                      .indexingSchedule ?? '',
                },
                {
                  title: '최근 전체 동기화 일시',
                  value: knowledgeBaseDetailData?.payload.syncCompletedAt
                    ? format(
                        new Date(
                          knowledgeBaseDetailData?.payload.syncCompletedAt,
                        ),
                        'yyyy-MM-dd HH:mm:ss',
                      )
                    : '',
                },
              ]}
            />
          </div>
          <div className="flex h-full w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
            <p className="text-xl font-bold">청킹 설정</p>
            <div className="h-[1px] w-full bg-[#E4E7EB]" />
            <ConfigCard
              data={
                knowledgeBaseDetailData?.payload.splitter === 'SEMANTIC'
                  ? [
                      {
                        title: '청킹 방식',
                        value: knowledgeBaseDetailData.payload.splitter ?? '',
                      },
                      {
                        title: '분할 기준 타입',
                        value:
                          knowledgeBaseDetailData.payload.splitterOptions
                            .breakPointType ?? '',
                      },
                      {
                        title:
                          knowledgeBaseDetailData.payload.splitterOptions
                            .breakPointType ?? '',
                        value:
                          knowledgeBaseDetailData.payload.splitterOptions
                            .breakPointAmount ?? '',
                      },
                    ]
                  : [
                      {
                        title: '청킹 방식',
                        value: knowledgeBaseDetailData?.payload.splitter ?? '',
                      },
                      {
                        title: '토큰 수',
                        value:
                          knowledgeBaseDetailData?.payload.splitterOptions
                            .chunkSize ?? '',
                      },
                      {
                        title: '중첩(Overlap) 토큰 수',
                        value:
                          knowledgeBaseDetailData?.payload.splitterOptions
                            .chunkOverlap ?? '',
                      },
                      {
                        title:
                          knowledgeBaseDetailData?.payload.splitter ===
                          'RECURSIVE'
                            ? '재귀 분할 허용 깊이'
                            : '분할 기준',
                        value:
                          knowledgeBaseDetailData?.payload.splitter ===
                          'RECURSIVE'
                            ? (knowledgeBaseDetailData?.payload.splitterOptions
                                .recursiveLevel ?? '')
                            : (knowledgeBaseDetailData?.payload.splitterOptions
                                .textStandard ?? ''),
                      },
                    ]
              }
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 items-stretch gap-7">
          <div className="flex h-full w-full flex-col gap-4 rounded-md border border-[#D0D5DD] px-7 py-5">
            <p className="text-xl font-bold">텍스트 전처리 설정</p>
            <div className="h-[1px] w-full bg-[#E4E7EB]" />
            <ConfigCard
              data={[
                {
                  title: '텍스트 정규화',
                  value: '대소문자 통일, 특수문자 제거',
                },
              ]}
            />
          </div>
          <div className="flex h-full w-full flex-col justify-center gap-4 rounded-md border border-[#D0D5DD] px-7">
            <p className="text-lg font-bold text-[#E60020]">유의사항 안내</p>
            <div className="text-sm">
              <p>
                - 지식베이스에 연결된 데이터 소스는 임베딩과 청킹 설정값에 따라
                벡터화되어 저장됩니다.
              </p>
              <p>
                - 임베딩 설정 또는 청킹 설정 변경 시 재벡터화하는 비용 및 시간이
                추가 발생하므로 설정 변경이 불가합니다.
              </p>
              <p>
                - 동일 파일로 임베딩 설정 또는 청킹 방법을 다르게 적용하려면
                신규 지식베이스를 생성하여야 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 연결된 서비스 목록 작업 예정 */}
        <ConnectedServiceList
          knowledgeBaseId={knowledgeBaseId ?? ''}
          orgInfo={{
            orgId: knowledgeBaseDetailData?.payload.organization.id ?? '',
            orgName:
              knowledgeBaseDetailData?.payload.organization.organName ?? '',
          }}
          knowledgeBaseInfo={{
            number: 1,
            id: knowledgeBaseId ?? '',
            name: knowledgeBaseDetailData?.payload.knowledgeName ?? '',
            embeddingModel:
              knowledgeBaseDetailData?.payload.embedderConfig.model ?? '',
            createdAt: knowledgeBaseDetailData?.payload.createdAt ?? '',
            createdBy: knowledgeBaseDetailData?.payload.createdBy ?? '',
          }}
        />
        <VectorDBDataSourceList
          id={knowledgeBaseDetailData?.payload.id ?? ''}
          organInfo={{
            organId: knowledgeBaseDetailData?.payload.organization.id ?? '',
            organName:
              knowledgeBaseDetailData?.payload.organization.organName ?? '',
          }}
        />
      </div>

      {/* 지식베이스 정보 변경 모달 */}
      {openChangeKnowledgeBaseInfoModal && (
        <ChangeKnowledgeBaseInfoModal
          title="지식베이스 정보 변경"
          knowledgeBaseInfo={{
            organId: knowledgeBaseDetailData?.payload.organization.id ?? '',
            organName:
              knowledgeBaseDetailData?.payload.organization.organName ?? '',
            knowledgeBaseId: knowledgeBaseId ?? '',
            knowledgeName: knowledgeBaseDetailData?.payload.knowledgeName ?? '',
            description: knowledgeBaseDetailData?.payload.description ?? '',
          }}
          closeModal={() => setOpenChangeKnowledgeBaseInfoModal(false)}
          refetchKnowledgeBaseDetail={refetch}
        />
      )}
    </div>
  );
};

export default KnowledgeDetailPage;

interface ChangeKnowledgeBaseInfoModalProps {
  title: string;
  knowledgeBaseInfo: {
    organId: string;
    organName: string;
    knowledgeBaseId: string;
    knowledgeName: string;
    description: string;
  };
  closeModal: () => void;
  refetchKnowledgeBaseDetail: () => void;
}

const ChangeKnowledgeBaseInfoModal = ({
  title,
  knowledgeBaseInfo,
  closeModal,
  refetchKnowledgeBaseDetail,
}: ChangeKnowledgeBaseInfoModalProps) => {
  // state
  const [changeKnowledgeBaseInfo, setChangeKnowledgeBaseInfo] = useState({
    organName: knowledgeBaseInfo.organName,
    knowledgeName: knowledgeBaseInfo.knowledgeName,
    description: knowledgeBaseInfo.description,
  });
  const [status, setStatus] = useState<'default' | 'success' | 'error'>(
    'default',
  );
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // 유효성 검사 query
  const { refetch } = useQuery({
    queryKey: ['knowledgeBaseNameAvailable'],
    queryFn: () =>
      checkKnowledgeBaseNameAvailableApi({
        organId: knowledgeBaseInfo.organId,
        knowledgeName: changeKnowledgeBaseInfo.knowledgeName,
      }),
    enabled: false,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => data.payload,
  });

  // 지식베이스 정보수정 query
  const { mutate: updateKnowledgeBaseInfo } = useMutation({
    mutationFn: () =>
      updateKnowledgeBaseInfoApi({
        id: knowledgeBaseInfo.knowledgeBaseId,
        knowledgeName: changeKnowledgeBaseInfo.knowledgeName,
        description: changeKnowledgeBaseInfo.description,
      }),
    onSuccess: () => {
      toast('지식베이스 정보를 수정했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      closeModal();
      refetchKnowledgeBaseDetail();
    },
    onError: () => {
      toast('지식베이스 정보를 수정하는데 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const handleKnowledgeNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setChangeKnowledgeBaseInfo({
      ...changeKnowledgeBaseInfo,
      knowledgeName: e.target.value,
    });
    setStatus('default');
    setIsValidated(false);
  };

  // 지식베이스명이 변경되면 확인버튼 비활성화
  useEffect(() => {
    if (
      knowledgeBaseInfo.knowledgeName !== changeKnowledgeBaseInfo.knowledgeName
    ) {
      setIsDisabled(true); // 확인버튼 비활성화
    } else {
      setIsDisabled(false); // 확인버튼 활성화
    }
  }, [knowledgeBaseInfo.knowledgeName, changeKnowledgeBaseInfo.knowledgeName]);

  // 지식베이스명 중복 확인 여부에 따라 확인버튼 활성화
  useEffect(() => {
    if (isDisabled && isValidated) {
      setIsDisabled(false);
    }
  }, [isDisabled, isValidated]);

  const handleDuplicateCheck = async () => {
    if (!changeKnowledgeBaseInfo.knowledgeName) {
      toast('지식베이스명을 입력해주세요.', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    const result = await refetch();
    const isAvailable =
      result.data &&
      knowledgeBaseInfo.knowledgeName !== changeKnowledgeBaseInfo.knowledgeName;

    setStatus(isAvailable ? 'success' : 'error');
    setIsValidated(true);

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

  const getBorderStyle = () => {
    switch (status) {
      case 'error':
        return 'border-2 border-[#E60020]';
      case 'success':
        return 'border-2 border-[#00C73C]';
      default:
        return 'border border-[#D0D5DD]';
    }
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      isDisabled={isDisabled}
      closeModal={closeModal}
      clickConfirmButton={() => updateKnowledgeBaseInfo()}
    >
      <p className="mb-6 text-2xl font-bold">{title}</p>
      <div className="mb-12 flex w-full flex-col gap-4">
        <p className="text-lg font-bold">지식베이스 기본 정보</p>
        <div className="flex h-9 w-full items-center text-[15px] font-medium">
          <p className="flex h-full w-[100px] items-center">회원사명</p>
          <p>{knowledgeBaseInfo.organName}</p>
        </div>
        <div className="flex h-9 w-full items-center text-[15px] font-medium">
          <p className="flex h-full w-[100px] items-center">지식베이스명</p>
          <Input
            className={`h-full flex-1 ${getBorderStyle()}`}
            value={changeKnowledgeBaseInfo.knowledgeName}
            onChange={handleKnowledgeNameChange}
          />
          <Button
            className="h-9 w-[80px] rounded-sm bg-[#667183] text-white"
            onClick={handleDuplicateCheck}
          >
            중복확인
          </Button>
        </div>
        <div className="flex w-full text-[15px] font-medium">
          <p className="flex h-9 w-[100px] items-center">지식베이스 설명</p>
          <Textarea
            className="h-[58px] flex-1"
            value={changeKnowledgeBaseInfo.description}
            onChange={(e) =>
              setChangeKnowledgeBaseInfo({
                ...changeKnowledgeBaseInfo,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>
    </ModalLayout>
  );
};
