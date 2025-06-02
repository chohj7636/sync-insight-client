import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  checkDirNameAvailable,
  postCreateDirectory,
} from '@/lib/api/datasource/api';
import { getCategoryListApi } from '@/lib/api/organizations/api';
import { CategoryTreeNode } from '@/shared/components/CatetoryTreeNode';
import ModalLayout from '@/shared/components/ModalLayout';
import TableModal from '@/shared/components/TableModal';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import useModal from '@/shared/hooks/useModal';
import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const RegisterDirectory = () => {
  const navigate = useNavigate();

  const [organInfo, setOrganInfo] = useState<{
    organName: string;
    organId: string;
  }>({
    organName: '',
    organId: '',
  });
  const [dirName, setDirName] = useState<string>('');
  const [dirDescription, setDirDescription] = useState<string | undefined>();
  const [isOwnershipSecured, setIsOwnershipSecured] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryBreadcrumb, setCategoryBreadcrumb] = useState<string>('');

  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openConnectCategoryModal, setOpenConnectCategoryModal] =
    useState(false);

  // 디렉토리명 유효성 검사 query
  const {
    data: dirNameAvailable,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ['dirNameAvailable'],
    queryFn: () =>
      checkDirNameAvailable({
        organId: organInfo.organId,
        dirName: dirName,
      }),
    enabled: false,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => data.payload,
  });

  // 디렉토리 생성 query
  const { mutate: createDirectory } = useMutation({
    mutationFn: postCreateDirectory,
    onSuccess: () => {
      toast('디렉토리 생성 성공', {
        duration: 2000,
        position: 'top-center',
      });
      navigate('/datasource/dirmanager');
    },
    onError: () => {
      toast('디렉토리 생성 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  // 유효성 검사에 따른 toast 출력 로직
  useEffect(() => {
    if (isFetched) {
      if (dirNameAvailable) {
        toast('사용 가능한 디렉토리명입니다.', {
          duration: 2000,
          position: 'top-center',
        });
      } else {
        toast(
          <>
            이미 등록된 이름입니다.
            <br />
            다른 이름을 입력해주세요.
          </>,
          {
            duration: 2000,
            position: 'top-center',
          },
        );
      }
    }
  }, [isFetched, dirNameAvailable]);

  return (
    <div className="flex flex-col gap-7">
      {openSearchModal && (
        <TableModal
          type="organization"
          title="회원사 찾기"
          clickConfirm={(organId, organName) => {
            setOrganInfo({
              organName,
              organId,
            });
          }}
          closeModal={() => setOpenSearchModal(false)}
        />
      )}
      <div className="flex w-full flex-col gap-4 rounded-[8px] border border-[#D0D5DD] px-7 py-5">
        <p className="text-[20px] font-bold">디렉토리 설정</p>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">디렉토리 기본 정보</p>

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
            <p className="w-[116px] text-[15px]">디렉토리명 *</p>
            <div className="flex gap-2">
              <Input
                className="h-[36px] w-[388px] rounded-sm bg-white"
                value={dirName}
                disabled={!organInfo.organId}
                onChange={(e) => setDirName(e.target.value)}
              />
              <Button
                className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-[14px] font-normal text-white"
                disabled={!organInfo.organId}
                onClick={() => refetch()}
              >
                찾아보기
              </Button>
              {dirNameAvailable && (
                <div className="flex h-[36px] w-[80px] items-center justify-center rounded-sm bg-[#E4E7EB] text-[14px] text-[#3F4959]">
                  확인완료
                </div>
              )}
            </div>
          </div>

          <div className="w-full pl-[136px]">
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3">
              <p className="text-[14px] text-[#98A2B2]">
                - 고유한 디렉토리 명을 입력해주세요.
              </p>
              <p className="text-[14px] text-[#98A2B2]">
                - 영문 소문자, 숫자, 하이픈(-) 입력 가능합니다.
              </p>
              <p className="text-[14px] text-[#98A2B2]">
                - 디렉토리명은 지식베이스 연결 시 사용되므로 신중하게
                입력해주세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">디렉토리 설명</p>
            <Textarea
              className="h-[56px] w-[874px] rounded-sm bg-white"
              onChange={(e) => setDirDescription(e.target.value)}
            />
          </div>

          <div className="h-[1px] w-full bg-[#E4E7EB]" />

          <p className="text-lg font-bold">카테고리 설정</p>
          <div className="flex items-center gap-5">
            <p className="w-[116px] text-[15px]">카테고리</p>
            <div className="flex gap-2">
              <div className="px-3 border flex items-center border-[#D0D5DD] rounded-sm min-w-[180px] h-9 text-[15px]">
                <p>{categoryBreadcrumb}</p>
              </div>
              <Button
                className="h-9 w-[80px] rounded-sm bg-[#667183] text-[14px] font-normal text-white"
                disabled={!organInfo.organId}
                onClick={() => setOpenConnectCategoryModal(true)}
              >
                선택하기
              </Button>
            </div>
          </div>
        </div>
        {openConnectCategoryModal && (
          <ConnectCategoryModal
            organId={organInfo.organId}
            closeModal={() => setOpenConnectCategoryModal(false)}
            clickConfirmButton={(id, breadcrumb) => {
              setCategoryId(id);
              setCategoryBreadcrumb(breadcrumb);
              setOpenConnectCategoryModal(false);
            }}
          />
        )}

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-lg font-bold">데이터 소유권 보호 설정</p>
            <p className="text-[14px] text-[#98A2B2]">
              이 설정을 활성화하면 해당 디렉토리에 업로드되는 데이터의 소유권을
              기관 전용 자산으로 간주하며, 플랜아이의 접근이 자동으로
              차단됩니다.
            </p>
          </div>

          <div id="button-wrapper" className="flex flex-col gap-2">
            <Button
              className={`${!isOwnershipSecured ? 'border-[#D5EBFF]' : 'border-[#F8F9FB]'} h-[120px] w-[1000px] items-start justify-start gap-4 rounded-md border-2 bg-white p-5 hover:border-[#D5EBFF] hover:bg-white`}
              onClick={() => setIsOwnershipSecured(false)}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      !isOwnershipSecured ? ActiveRadioIcon : InactiveRadioIcon
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
              className={`${isOwnershipSecured ? 'border-[#D5EBFF]' : 'border-[#F8F9FB]'} h-[120px] w-[1000px] items-start justify-start gap-4 rounded-md border-2 bg-white p-5 hover:border-[#D5EBFF] hover:bg-white`}
              onClick={() => setIsOwnershipSecured(true)}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      isOwnershipSecured ? ActiveRadioIcon : InactiveRadioIcon
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
      </div>

      {/* button wrapper */}
      <div className="flex w-full justify-end">
        <Button
          className="h-[52px] w-[200px] rounded-sm bg-[#0066C3] text-[14px] text-white hover:bg-[#00449D]"
          disabled={!organInfo.organId || !dirNameAvailable}
          onClick={() =>
            createDirectory({
              organId: organInfo.organId,
              dirName: dirName,
              description: dirDescription,
              isOwnershipSecured: isOwnershipSecured,
              categoryId: categoryId,
            })
          }
        >
          저장
        </Button>
      </div>
    </div>
  );
};

const ConnectCategoryModal = ({
  organId,
  closeModal,
  clickConfirmButton,
}: {
  organId: string;
  closeModal: () => void;
  clickConfirmButton: (categoryId: string, breadcrumb: string) => void;
}) => {
  const { modal, modalClose } = useModal();
  const navigate = useNavigate();

  // state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedCategoryBreadcrumb, setSelectedCategoryBreadcrumb] =
    useState<string>('');

  // 카테고리 조회 query
  const { data: categoryListResponseData } = useQuery({
    queryKey: ['categoryListResponseData', organId],
    queryFn: () => getCategoryListApi({ organId }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: (data) => data.payload,
  });

  const clickCategory = (
    _: string,
    selectedId: string,
    selectedBreadcrumb?: string,
  ) => {
    setSelectedCategoryId(selectedId);
    setSelectedCategoryBreadcrumb(selectedBreadcrumb ?? '');
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() =>
        clickConfirmButton(selectedCategoryId, selectedCategoryBreadcrumb)
      }
    >
      <p className="text-2xl font-bold">카테고리 선택</p>
      <div className="flex flex-col gap-5 w-full mt-5 mb-9">
        <div className="flex justify-between items-center gap-5 w-full">
          <p className="text-lg font-bold">카테고리 목록</p>
          <Button
            className="h-7 rounded-sm border-[#0066C3] text-sm font-normal text-[#0066C3] px-3"
            onClick={() => {
              modal({
                title: '카테고리 관리를 위해 회원사 기본정보로 이동합니다.',
                description:
                  '작성 중인 내용은 모두 사라집니다. 그래도 계속 하시겠습니까?',
                status: 'info',
                eventButton: {
                  title: '계속',
                  clickEvent: () => {
                    modalClose();
                    navigate(`/organizations/list/${organId}`, {
                      state: {
                        scrollTo: 'category-config',
                      },
                    });
                  },
                },
              });
            }}
          >
            카테고리 관리
          </Button>
        </div>

        <div className="w-full p-4 border border-[#D0D5DD] rounded-sm">
          {categoryListResponseData &&
            categoryListResponseData.map((category) => (
              <CategoryTreeNode
                readonly
                key={category.id}
                node={category}
                selectedId={selectedCategoryId}
                onSelect={clickCategory}
              />
            ))}
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <div className="flex flex-col gap-4 w-full">
          <p className="text-lg font-bold">선택된 카테고리</p>
          <div className="w-full h-9 flex items-center rounded-sm border border-[#D0D5DD] px-3 text-[15px]">
            <p>{selectedCategoryBreadcrumb}</p>
          </div>
          <div className="w-full p-3 bg-[#F8F9FB] text-sm text-[#98A2B2]">
            <p>- 선택한 카테고리로 지정됩니다.</p>
            <p>- 시스템 프롬프트에 붙여 정확도를 높일 수 있습니다.</p>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};

export default RegisterDirectory;
