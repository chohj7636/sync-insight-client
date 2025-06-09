import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCategoryListApi } from '@/entities/categoryList/api/api';
import {
  checkDirNameAvailable,
  deleteDirectory,
  getDirectoryDetail,
  updateDirectoryInfo,
} from '@/lib/api/datasource/api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useChangeCategoryModal } from '@/shared/hooks/modals/useChangeCategoryModal';
import useModal from '@/shared/hooks/useModal';
import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';
import ChangeCategoryModal from '@/widgets/modal/ChangeCategoryModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DirectoryInfoPanelProps {
  organId: string;
  organName: string;
  dirId: string;
  dirName: string;
  categoryBreadcrumb: string;
  categoryId: string;
  description: string;
  creator: string | null;
  createdAt: string;
  updatedAt: string;
  isOwnershipSecured: boolean;
}

const DirectoryInfoPanel = ({
  organId,
  organName,
  dirId,
  dirName,
  categoryBreadcrumb,
  categoryId,
  description,
  creator,
  createdAt,
  updatedAt,
  isOwnershipSecured,
}: DirectoryInfoPanelProps) => {
  const navigate = useNavigate();
  const { modal, modalClose } = useModal();
  const {
    isOpen,
    setIsOpen,
    setOrganId,
    setTargetDirList,
    setCategoryList,
    setCategoryId,
    setCategoryBreadcrumb,
    setRefetch,
  } = useChangeCategoryModal();

  // 카테고리 조회 query
  const { data: categoryListResponseData } = useQuery({
    queryKey: ['categoryListResponseData', organId],
    queryFn: () => getCategoryListApi({ organId }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: (data) => data.payload,
  });

  // refetch
  const { refetch: refetchDirDetail } = useQuery({
    queryKey: ['dirDetail', dirId],
    queryFn: () => getDirectoryDetail({ dirId: dirId ?? '' }),
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 디렉토리 삭제 query
  const { mutate: deleteDir } = useMutation({
    mutationFn: () => deleteDirectory({ id: dirId }),
    onSuccess: () => {
      modalClose();
      toast.success('디렉토리가 삭제되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      navigate('/datasource/dirmanager');
    },
    onError: () => {
      toast.error('디렉토리 삭제에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // state
  const [isModifyDirectoryInfoModalOpen, setIsModifyDirectoryInfoModalOpen] =
    useState(false);

  useEffect(() => {
    return () => {
      setIsModifyDirectoryInfoModalOpen(false);
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <div id="button-wrap" className="flex items-center justify-end gap-2">
        <Button
          className="h-[28px] w-[123px] rounded-sm border border-[#0066C3] bg-white text-sm text-[#0066C3] hover:bg-white"
          onClick={() => setIsModifyDirectoryInfoModalOpen(true)}
        >
          디렉토리 정보 변경
        </Button>
        <Button
          className="h-[28px] w-[117px] rounded-sm border border-[#E60020] bg-white text-sm text-[#E60020] hover:bg-white"
          onClick={() => {
            modal({
              title: '디렉토리 삭제 시 등록된 하위 파일이 모두 삭제됩니다.',
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
                clickEvent: () => deleteDir(),
              },
            });
          }}
        >
          디렉토리 삭제
        </Button>
      </div>
      {isModifyDirectoryInfoModalOpen && (
        <ModifyDirectoryInfoModal
          organId={organId}
          organName={organName}
          dirId={dirId}
          description={description}
          dirName={dirName}
          isOwnershipSecured={isOwnershipSecured}
          modalClose={() => setIsModifyDirectoryInfoModalOpen(false)}
        />
      )}

      <div className="flex w-full flex-col gap-4 border-t border-t-black bg-[#F8F9FB] px-5 py-4 text-[#27303F]">
        <div className="flex items-center gap-6">
          <p className="w-[160px] text-sm">회원사명</p>
          <p className="text-lg font-bold">{organName}</p>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-1/2 items-center gap-6">
            <p className="w-[160px] text-sm">디렉토리명</p>
            <p className="text-lg font-bold">{dirName}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="w-[160px] text-sm">데이터 소유권 보호 설정</p>
            {isOwnershipSecured ? (
              <div className="h-[20px] w-[43px] rounded-sm bg-[#D5EBFF] text-center text-sm text-[#0066C3]">
                ON
              </div>
            ) : (
              <div className="h-[20px] w-[43px] rounded-sm bg-[#FEE2E2] text-center text-sm text-[#DC2626]">
                OFF
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <p className="w-[160px] text-sm">디렉토리 설명</p>
          <p className="text-[15px]">{description}</p>
        </div>
        <div className="h-[1px] w-full bg-[#D0D5DD]" />
        <div className="flex w-full items-center">
          <div className="flex w-1/2 items-center gap-6">
            <p className="w-[160px] text-sm">생성자</p>
            <p className="text-[15px]">{creator}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="w-[160px] text-sm">카테고리</p>
            <div className="flex items-center gap-6">
              <p className="text-[15px]">{categoryBreadcrumb}</p>
              <Button
                className="border-[#0066C3] text-[#0066C3] px-3 h-7"
                onClick={() => {
                  setIsOpen(true);
                  setOrganId(organId);
                  setTargetDirList([
                    {
                      id: dirId,
                      dirName: dirName,
                      categoryBreadcrumb: categoryBreadcrumb,
                    },
                  ]);
                  setCategoryList(categoryListResponseData ?? []);
                  setCategoryId(categoryId);
                  setCategoryBreadcrumb(categoryBreadcrumb);
                  setRefetch(() => refetchDirDetail());
                }}
              >
                카테고리 변경
              </Button>
            </div>
          </div>
        </div>
        {isOpen && <ChangeCategoryModal />}

        <div className="flex w-full items-center">
          <div className="flex w-1/2 items-center gap-6">
            <p className="w-[160px] text-sm">최초생성일</p>
            <p className="text-[15px]">
              {format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="w-[160px] text-sm">최근 수정일</p>
            <p className="text-[15px]">
              {format(new Date(updatedAt), 'yyyy-MM-dd HH:mm:ss')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryInfoPanel;

interface ModifyDirectoryInfoModalProps {
  organId: string;
  organName: string;
  dirId: string;
  description: string | null;
  dirName: string;
  isOwnershipSecured: boolean;
  modalClose: () => void;
}

const ModifyDirectoryInfoModal = ({
  organId,
  organName,
  dirId,
  description,
  dirName,
  isOwnershipSecured,
  modalClose,
}: ModifyDirectoryInfoModalProps) => {
  const queryClient = useQueryClient();

  const [modifyDirName, setModifyDirName] = useState<string>(dirName);
  const [modifyDescription, setModifyDescription] = useState<string | null>(
    description,
  );
  const [modifyOwnershipSecured, setModifyOwnershipSecured] =
    useState<boolean>(isOwnershipSecured);
  const [status, setStatus] = useState<'default' | 'success' | 'error'>(
    'default',
  );
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // 디렉토리명이 변경되면 확인버튼 비활성화
  useEffect(() => {
    if (dirName !== modifyDirName) {
      setIsDisabled(true); // 확인버튼 비활성화
    } else {
      setIsDisabled(false); // 확인버튼 활성화
    }
  }, [dirName, modifyDirName]);

  // 디렉토리명 중복 확인 여부에 따라 확인버튼 활성화
  useEffect(() => {
    if (isDisabled && isValidated) {
      setIsDisabled(false);
    }
  }, [isDisabled, isValidated]);

  // 디렉토리명 중복 확인
  const { refetch } = useQuery({
    queryKey: ['dirNameAvailable'],
    queryFn: () =>
      checkDirNameAvailable({
        organId,
        dirName: modifyDirName,
      }),
    enabled: false,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // 디렉토리 정보 업데이트
  const { mutate: updateDirInfo } = useMutation({
    mutationFn: () =>
      updateDirectoryInfo({
        dirId,
        dirName: modifyDirName,
        description: modifyDescription ?? undefined,
        isOwnershipSecured: modifyOwnershipSecured,
      }),
    onSuccess: () => {
      toast('디렉토리 정보를 수정했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      queryClient.invalidateQueries({
        queryKey: ['dirDetail', dirId],
      });
      modalClose();
    },
    onError: () => {
      toast('디렉토리 정보 수정에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const handleDirNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifyDirName(e.target.value);
    setStatus('default');
    setIsValidated(false);
  };

  const handleDuplicateCheck = async () => {
    if (!modifyDirName) {
      toast('디렉토리명을 입력해주세요.', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    const result = await refetch();
    const isAvailable = result.data?.payload && dirName !== modifyDirName;

    setStatus(isAvailable ? 'success' : 'error');
    setIsValidated(true);

    toast(
      isAvailable ? (
        '사용 가능한 디렉토리명입니다.'
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
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
      <div className="w-[580px] rounded-md bg-white p-8">
        <p className="mb-6 text-2xl font-bold text-[#27303F]">
          디렉토리 기본정보 수정
        </p>
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full">
            <p className="flex h-[36px] w-[120px] items-center text-[15px] font-medium text-[#27303F]">
              회원사명
            </p>
            <div className="flex w-full flex-col gap-1">
              <Input
                className={
                  'h-[36px] w-full rounded-sm border border-[#D0D5DD] text-[#98A2B2] disabled:text-[15px]'
                }
                value={organName}
                disabled
              />
              <p className="text-sm text-[#98A2B2]">
                디렉토리의 회원사는 변경할 수 없습니다.
              </p>
            </div>
          </div>

          <div className="flex w-full">
            <p className="flex h-[36px] w-[120px] items-center text-[15px] font-medium text-[#27303F]">
              디렉토리명*
            </p>
            <div className="flex w-full flex-col gap-5">
              <div className="relative flex w-full gap-2">
                <Input
                  className={`h-[36px] flex-1 rounded-sm text-[15px] text-[#27303F] ${getBorderStyle()}`}
                  value={modifyDirName}
                  onChange={handleDirNameChange}
                />
                <Button
                  className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-white"
                  onClick={handleDuplicateCheck}
                >
                  중복확인
                </Button>
              </div>
              <div className="w-full rounded-sm bg-[#F8F9FB] p-3">
                <p className="text-sm text-[#98A2B2]">
                  - 고유한 디렉토리 명을 입력해주세요.
                </p>
                <p className="text-sm text-[#98A2B2]">
                  - 영문 소문자, 숫자, 하이픈(-) 입력 가능합니다.
                </p>
                <p className="text-sm text-[#98A2B2]">
                  - 디렉토리명은 지식베이스 연결 시 사용되므로 신중하게
                  입력해주세요.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full">
            <p className="flex h-[36px] w-[120px] items-center text-[15px] font-medium text-[#27303F]">
              디렉토리 설명
            </p>
            <div className="flex w-full flex-col gap-5">
              <Textarea
                className="h-[36px] flex-1 rounded-sm border border-[#D0D5DD] text-[#98A2B2] disabled:text-[15px]"
                value={modifyDescription ?? ''}
                onChange={(e) => setModifyDescription(e.target.value)}
              />
            </div>
          </div>

          <p className="text-[18px] font-bold text-[#27303F]">
            데이터 소유권 설정
          </p>

          <div id="button-wrapper" className="flex w-full flex-col gap-2">
            <Button
              className={`${!modifyOwnershipSecured ? 'border-[#D5EBFF]' : 'border-[#F8F9FB]'} h-[120px] w-full items-start justify-start gap-4 rounded-md border-2 bg-white p-5 hover:border-[#D5EBFF] hover:bg-white`}
              onClick={() => setModifyOwnershipSecured(false)}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      !modifyOwnershipSecured
                        ? ActiveRadioIcon
                        : InactiveRadioIcon
                    }
                    alt="RadioIcon"
                  />
                  <p className="text-[16px] font-bold text-[#27303F]">
                    데이터 소유권 보호 비활성화
                  </p>
                  <div className="h-[20px] rounded-sm bg-[#D5EBFF] px-2 text-[14px] text-[#0066C3]">
                    권장
                  </div>
                </div>
                <div className="ml-[28px] flex flex-col items-start text-[15px] text-[#27303F]">
                  <p>저장소 내 모든 객체가 플랜아이에 공개됩니다.</p>
                  <p>
                    접근 제어는 정책 기반(예: 역할, 권한 정책 등)으로 일관성
                    있게 관리됩니다.
                  </p>
                </div>
              </div>
            </Button>
            <Button
              className={`${modifyOwnershipSecured ? 'border-[#D5EBFF]' : 'border-[#F8F9FB]'} h-[120px] w-full items-start justify-start gap-4 rounded-md border-2 bg-white p-5 hover:border-[#D5EBFF] hover:bg-white`}
              onClick={() => setModifyOwnershipSecured(true)}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      modifyOwnershipSecured
                        ? ActiveRadioIcon
                        : InactiveRadioIcon
                    }
                    alt="RadioIcon"
                  />
                  <p className="text-[16px] font-bold text-[#27303F]">
                    데이터 소유권 보호 활성화
                  </p>
                </div>
                <div className="ml-[28px] flex flex-col items-start text-[15px] text-[#27303F]">
                  <p>
                    디렉토리에 업로드되는 데이터의 소유권이 해당 계정(기관)에
                    귀속됩니다.
                  </p>
                  <p>보안 중요도가 높은 자료가 업로드 될 때 활성화합니다.</p>
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div
          id="check-button-wrap"
          className="mt-12 flex items-center justify-between"
        >
          <Button
            className="h-[52px] w-[205px] rounded-[8px] border border-[#E4E7EB] bg-white text-[15px] font-bold text-[#4C5667] hover:bg-white"
            onClick={modalClose}
          >
            취소
          </Button>
          <Button
            className="h-[52px] w-[205px] rounded-[8px] bg-[#0066C3] text-[15px] font-bold text-white hover:bg-[#0066C3]"
            disabled={isDisabled}
            onClick={() => updateDirInfo()}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
