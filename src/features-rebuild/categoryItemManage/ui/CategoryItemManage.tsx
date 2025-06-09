import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { CategoryList } from '@/entities/categoryList/api/type';
import { useCategoryList } from '@/entities/categoryList/hooks/useCategoryList';
import { useSearchDirInCategory } from '@/entities/directoryListInCategory/hooks/useSearchDirInCategory';
import { DirectoryListData } from '@/lib/api/datasource/type';
import { CategoryTreeNode } from '@/shared/components/CatetoryTreeNode';
import { DefaultTable } from '@/shared/components/DefaultTable';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import {
  targetDirListState,
  useChangeCategoryModal,
} from '@/shared/hooks/modals/useChangeCategoryModal';
import { useSearchDirectoryModal } from '@/shared/hooks/modals/useSearchDirectoryModal';
import useModal from '@/shared/hooks/useModal';
import FolderIcon from '@/shared/icons/icon-folder.svg';
import { format } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { PostCategoryList } from '../api/type';
import { useCategoryManage } from '../hooks/useCategoryManage';

interface CategoryItemManageProps {
  organId: string;
  categoryEnabledState: boolean;
}

const CategoryItemManage = ({
  organId,
  categoryEnabledState,
}: CategoryItemManageProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryConfigRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { modal } = useModal();
  const {
    setIsOpen,
    setOrganId,
    setTargetDirList,
    setCategoryList: setCategoryListModal,
    setRefetch,
  } = useChangeCategoryModal();

  const {
    setIsOpen: setIsOpenSearchDirModal,
    setTitle,
    setSelectedOrganId,
    setType,
    setSelectedDataSource,
    setClickConfirmButton,
  } = useSearchDirectoryModal();
  // state
  const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [addCategoryInfo, setAddCategoryInfo] = useState({
    name: '',
    id: '',
  });
  const [checkedFiles, setCheckedFiles] = useState<targetDirListState[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [currentCategoryIds, setCurrentCategoryIds] = useState<string>(''); // id depth를 문자열로 출력
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  // const [openSearchDirModal, setOpenSearchDirModal] = useState(false);
  // const [openChangeCategoryModal, setOpenChangeCategoryModal] = useState(false);
  // const [onlyOneChangeCategory, setOnlyOneChangeCategory] = useState<
  //   ChangeCategoryModalProps['targetDirList']
  // >([]);

  // category 조회 query
  const { categoryListResponseData, refetchCategoryList } = useCategoryList({
    organId,
  });
  // 카테고리 소속 디렉토리 검색 query
  const { categoryDirectoryList, refetchCategoryDirectoryList } =
    useSearchDirInCategory(organId, currentCategoryIds);
  // category 추가, 삭제
  const {
    postCategoryListUpdate,
    deleteCategory,
    disconnectCategory,
    postConnectDirectory,
  } = useCategoryManage({
    setAddCategoryInfo,
    refetchCategoryList,
    refetchCategoryDirectoryList,
  });

  useEffect(() => {
    if (currentCategoryIds) {
      refetchCategoryDirectoryList();
    }
  }, [currentCategoryIds, refetchCategoryDirectoryList]);

  // 디렉토리 생성 > 카테고리 선택 모달에서 라우팅 된 경우 카테고리 영역으로 스크롤
  useEffect(() => {
    if (location.state?.scrollTo === 'category-config') {
      categoryConfigRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [location]);

  // 카테고리 조회 응답값을 통해 state 업데이트. 카테고리 리스트는 useState로 관리
  useEffect(() => {
    if (categoryListResponseData) {
      setCategoryList(categoryListResponseData);
    }
  }, [categoryListResponseData]);

  const addCategory = () => {
    setCategoryList([
      ...categoryList,
      {
        id: '',
        name: '',
        breadcrumb: '',
        count: 0,
        includedSubtreeIds: [],
        children: [],
      },
    ]);
  };

  // Input이 마운트될 때 포커스 주기
  useEffect(() => {
    // categoryList에 id가 빈 문자열인 항목이 있을 때만 포커스
    const hasEmptyId = categoryList.some((category) => category.id === '');
    if (hasEmptyId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [categoryList]); // categoryList가 변경될 때마다 실행

  const handleInputBlur = () => {
    // blur 이벤트 발생 시 해당 요소 삭제
    setCategoryList(categoryList.filter((category) => category.id !== ''));
    setAddCategoryInfo({ name: '', id: '' });
  };

  const confirmAddCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedList: PostCategoryList[] = categoryList.map((category) => {
      if (category.id === '') {
        return {
          id: addCategoryInfo.name,
          name: addCategoryInfo.name,
          children: [],
        };
      }
      return {
        id: category.id,
        name: category.name,
        children: category.children.map((child) => ({
          id: child.id,
          name: child.name,
          children: child.children,
        })),
      };
    });

    postCategoryListUpdate({
      organId,
      categoryList: updatedList,
    });
  };

  useEffect(() => {
    if (allChecked) {
      setCheckedFiles(
        categoryDirectoryList?.map((category) => ({
          id: category['id'],
          dirName: category['dirName'],
          categoryBreadcrumb: category['categoryBreadcrumb'],
        })) || [],
      );
    } else {
      setCheckedFiles([]);
    }
  }, [allChecked, categoryDirectoryList]);

  const clickCategory = (categoryIds: string, selectedId: string) => {
    setCurrentCategoryIds(categoryIds);
    setSelectedCategoryId(selectedId);
  };

  const clickDeleteCategory = (categoryId: string) => {
    if (
      categoryList.length === 1 &&
      categoryList[0].children.length === 0 &&
      categoryEnabledState
    ) {
      toast.error(
        '카테고리 사용이 활성화 된 경우 최소 1개 이상의 카테고리를 사용하여야 합니다.',
        {
          duration: 2000,
          position: 'top-center',
        },
      );
      return;
    }
    modal({
      title: '삭제 시 하위 분류 및 연결된 디렉토리 정보가 모두 삭제됩니다.',
      description: '그래도 계속 하시겠습니까?',
      status: 'info',
      eventButton: {
        title: '계속',
        clickEvent: () => {
          deleteCategory({
            organId,
            categoryId,
          });
        },
      },
    });
  };

  const moveCategory = (beforeId: string, afterId: string) => {
    const postCategoryList = categoryList.map((category) => ({
      id: category.id,
      name: category.name,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        children: child.children,
      })),
    }));

    // 현재 카테고리 리스트에서 드래그된 카테고리 가져오기
    const draggedCategory = findNodeById(categoryList, beforeId);

    // 새로운 카테고리 리스트 생성할때 beforeId를 가지는 카테고리 노드를 삭제하고 생성
    const removeCategoryList = removeCategoryById(postCategoryList, beforeId);
    const addCategoryList = addCategoryById(
      removeCategoryList,
      afterId,
      draggedCategory,
    );

    postCategoryListUpdate({
      organId,
      categoryList: addCategoryList,
    });
  };

  // 재귀 함수를 사용한 검색 함수
  const findNodeById = (
    nodes: CategoryList[],
    targetId: string,
  ): PostCategoryList | null => {
    // 배열의 각 노드에 대해 검색
    for (const node of nodes) {
      // 현재 노드의 ID가 일치하는 경우 현재 노드 반환
      if (node.id === targetId) {
        return {
          id: node.id,
          name: node.name,
          children: node.children.map((child) => ({
            id: child.id,
            name: child.name,
            children: child.children,
          })),
        };
      }

      // children이 있는 경우 재귀적으로 검색
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, targetId);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  // 재귀 함수를 통해 특정 id를 가지고 있는 카테고리 노드를 찾아 삭제
  const removeCategoryById = (
    categoryList: PostCategoryList[],
    targetId: string,
  ) => {
    return categoryList.filter((category) => {
      if (category.id === targetId) {
        return false;
      }
      if (category.children.length > 0) {
        category.children = removeCategoryById(category.children, targetId);
      }

      return true;
    });
  };

  // 재귀함수를 통해 드랍된 위치의 children에 카테고리 노드 추가
  const addCategoryById = (
    categoryList: PostCategoryList[],
    targetId: string,
    categoryNode: PostCategoryList | null,
  ): PostCategoryList[] => {
    return categoryList.map((category) => {
      // 현재 카테고리의 복사본 생성
      const newCategory = { ...category };

      // 현재 카테고리가 타겟인 경우
      if (category.id === targetId && categoryNode) {
        // 이미 children에 있는지 확인
        const isAlreadyAdded = category.children.some(
          (child) => child.id === categoryNode.id,
        );

        // 없는 경우에만 추가
        if (!isAlreadyAdded) {
          newCategory.children = [...category.children, categoryNode];
        }
        return newCategory; // 타겟을 찾았으면 여기서 반환
      }

      // 타겟이 아닌 경우에만 children 재귀 검사
      if (category.children.length > 0) {
        newCategory.children = addCategoryById(
          category.children,
          targetId,
          categoryNode,
        );
      }

      return newCategory;
    });
  };

  const addChildCategory = (
    parentId: string,
    newCategoryItem: PostCategoryList,
  ) => {
    // 재귀 함수를 사용하여 특정 ID를 가진 카테고리를 찾고 children 업데이트
    const updateCategoryChildren = (
      categories: PostCategoryList[],
    ): PostCategoryList[] => {
      return categories.map((category) => {
        if (category.id === parentId) {
          // 부모 카테고리를 찾았을 때 children 업데이트
          return {
            ...category,
            children: [...category.children, newCategoryItem],
          };
        }
        if (category.children.length > 0) {
          // 자식 카테고리들도 재귀적으로 검사
          return {
            ...category,
            children: updateCategoryChildren(category.children),
          };
        }
        return category;
      });
    };

    // 전체 카테고리 리스트 업데이트
    const updatedCategoryList = updateCategoryChildren(
      categoryList.map((category) => ({
        id: category.id,
        name: category.name,
        children: category.children.map((child) => ({
          id: child.id,
          name: child.name,
          children: child.children,
        })),
      })),
    );

    // API 호출
    postCategoryListUpdate({
      organId,
      categoryList: updatedCategoryList,
    });
  };

  const openChangeCategoryModal = (targetList: targetDirListState[]) => {
    setIsOpen(true);
    setOrganId(organId);
    setTargetDirList(targetList);
    setCategoryListModal(categoryList);
    setRefetch(() => {
      refetchCategoryList();
      refetchCategoryDirectoryList();
    });
  };

  const connectDirectory = (dirList: DirectoryListData[]) => {
    const dirIds = dirList.map((dir) => dir.dirId);
    postConnectDirectory({
      organId,
      categoryId: selectedCategoryId,
      directoryIds: dirIds,
    });
  };

  const HEADERLIST = [
    {
      label: '',
      key: 'select',
      render: (_: string, dataItem: Record<string, string>) => (
        <Checkbox
          checked={checkedFiles.some((file) => file.id === dataItem['id'])}
          onCheckedChange={() =>
            setCheckedFiles((prev) =>
              prev.some((file) => file.id === dataItem['id'])
                ? prev.filter((file) => file.id !== dataItem['id'])
                : [
                    ...prev,
                    {
                      id: dataItem['id'],
                      dirName: dataItem['dirName'],
                      categoryBreadcrumb: dataItem['categoryBreadcrumb'],
                    },
                  ],
            )
          }
        />
      ),
    },
    { label: '디렉토리명', key: 'dirName' },
    {
      label: '카테고리',
      key: 'categoryBreadcrumb',
    },
    {
      label: '디렉토리 생성일',
      key: 'createdAt',
      render: (value: string) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
    },
    { label: '생성자', key: 'createdBy' },
    {
      label: '관리',
      key: 'management',
      children: [
        {
          key: 'id',
          style: 'w-[110px]',
          render: (_: string, dataItem: Record<string, string>) => (
            <Button
              className="h-5 border border-[#4C5667] px-2 text-sm text-[#4C5667]"
              onClick={() => {
                openChangeCategoryModal([
                  {
                    id: dataItem['id'],
                    dirName: dataItem['dirName'],
                    categoryBreadcrumb: dataItem['categoryBreadcrumb'],
                  },
                ]);
              }}
            >
              카테고리 변경
            </Button>
          ),
        },
        {
          key: 'id',
          style: 'w-[60px]',
          render: (_: string, dataItem: Record<string, string>) => (
            <Button
              className="h-5 border border-[#E60020] px-2 text-sm text-[#E60020]"
              onClick={() => {
                disconnectCategory({
                  directoryIds: [dataItem['id']],
                  categoryId: null,
                  organId,
                });
              }}
            >
              해제
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-lg font-bold">카테고리 항목 관리</p>

      <div className="flex items-center gap-5" ref={categoryConfigRef}>
        <p className="text-[15px] font-bold">카테고리 항목 관리</p>
        <p className="text-sm text-[#4C5667]">
          카테고리 설정 시 사용자가 검색에서 해당 카테고리를 선택하여 검색할 수
          있습니다. 카테고리에 지정된 디렉토리에서 검색결과를 찾아 보여줍니다.
        </p>
      </div>

      <div className="flex w-full gap-4">
        {/* category */}
        <div className="w-[380px] p-4 rounded-sm border border-[#D0D5DD] gap-2 flex flex-col">
          <div className="w-full border border-[#D0D5DD] bg-[#F8F9FB] rounded-md px-4 py-3 flex items-center justify-between">
            <p className="text-[#27303F] text-[15px] font-bold">
              카테고리 전체 목록
            </p>
            <Button
              className="h-7 rounded-sm bg-[#667183] px-3 text-sm text-white"
              onClick={addCategory}
            >
              + 최상위 카테고리 추가
            </Button>
          </div>
          <div className="w-full">
            <div className="flex flex-col">
              {categoryList.map((category) => {
                if (category.id) {
                  return (
                    <CategoryTreeNode
                      key={category.id}
                      node={category}
                      selectedId={selectedCategoryId}
                      onSelect={clickCategory}
                      onDelete={clickDeleteCategory}
                      moveCategory={moveCategory}
                      onAddChildCategory={addChildCategory}
                    />
                  );
                }
                // 최상위 카테고리 클릭시 렌더
                return (
                  <div key={category.id} className="flex items-center h-9 px-2">
                    <img className="mr-1" src={FolderIcon} alt="" />
                    <Input
                      ref={inputRef}
                      value={addCategoryInfo.name}
                      onChange={(e) => {
                        setAddCategoryInfo({
                          ...addCategoryInfo,
                          name: e.target.value,
                        });
                      }}
                      onBlur={handleInputBlur}
                    />
                    <div className="ml-2 flex gap-1">
                      <button
                        className="p-1 rounded hover:bg-blue-100"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={confirmAddCategory}
                      >
                        <PlusIcon className="w-4 cursor-pointer h-4 text-blue-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* table */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex justify-end gap-2 h-7">
            <Button
              className="px-3 rounded-sm bg-white border-[#E4E7EB] font-normal"
              onClick={() => openChangeCategoryModal(checkedFiles)}
            >
              카테고리 변경
            </Button>
            <Button
              className="px-3 rounded-sm bg-[#667183] text-white font-normal"
              onClick={() => {
                if (currentCategoryIds) {
                  setIsOpenSearchDirModal(true);
                  setTitle('디렉토리 찾기');
                  setSelectedOrganId(organId);
                  setType('CATEGORY');
                  setSelectedDataSource([]);
                  setClickConfirmButton(connectDirectory);
                } else {
                  toast.error('카테고리를 선택해주세요.', {
                    duration: 2000,
                    position: 'top-center',
                  });
                }
              }}
            >
              + 디렉토리 연결
            </Button>
          </div>
          <DefaultTable
            headerList={HEADERLIST}
            data={categoryDirectoryList ?? []}
            onClickAllCheckbox={() => setAllChecked((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryItemManage;
