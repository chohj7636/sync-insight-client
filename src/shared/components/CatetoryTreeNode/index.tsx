import { useEffect, useRef, useState } from 'react';
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd';

import { CategoryList, PostCategoryList } from '@/lib/api/organizations/type';
import { Input } from '@/shared/components/ui/input';
import FolderIcon from '@/shared/icons/icon-folder.svg';
import { PlusIcon } from 'lucide-react';
import { ChevronDownIcon } from 'lucide-react';
import { ChevronRightIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { GripHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface DragItem {
  id: string;
  type: string;
  name: string;
  children: DragItem[];
  includedSubtreeIds: string[];
}

interface CategoryTreeNodeProps {
  readonly?: boolean;
  node: CategoryList;
  depth?: number;
  selectedId?: string;
  onSelect: (
    categoryIds: string,
    selectedId: string,
    selectedBreadcrumb?: string,
  ) => void;
  onDelete?: (categoryId: string) => void;
  moveCategory?: (beforerId: string, afterId: string) => void;
  onAddChildCategory?: (
    parentId: string,
    newCategory: PostCategoryList,
  ) => void;
}

export const CategoryTreeNode = ({
  readonly = false,
  node,
  depth = 0,
  selectedId,
  onSelect,
  onDelete,
  moveCategory,
  onAddChildCategory,
}: CategoryTreeNodeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // state
  const [isExpanded, setIsExpanded] = useState(true);
  const [categoryChildren, setCategoryChildren] = useState<CategoryList[]>(
    node.children,
  );
  const [addCategoryInfo, setAddCategoryInfo] = useState({
    name: '',
    id: '',
  });

  useEffect(() => {
    setCategoryChildren(node.children);
  }, [node.children]);

  // 드래그 설정
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'CATEGORY',
    item: {
      id: node.id,
      type: 'CATEGORY',
      name: node.name,
      children: node.children,
      includedSubtreeIds: node.includedSubtreeIds,
    }, // 드래그 시 전송될 아이템 데이터 설정
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 드롭 설정
  const [{ isOver }, drop] = useDrop({
    accept: 'CATEGORY',
    drop: (item: DragItem) => {
      // 부모를 children에 드랍 불가능
      if (item.includedSubtreeIds.includes(node.id)) {
        toast.error('하위 카테고리로 이동할 수 없습니다.', {
          duration: 2000,
          position: 'top-center',
        });
        return;
      }

      // 드롭 가능한 경우에만 moveCategory 실행
      moveCategory?.(item.id, node.id);
    },
    canDrop: (item) => {
      // 자기 자신에게 드랍 불가능
      if (item.id === node.id) return false;
      // 바로 위 depth에 드롭 불가능(드롭 무의미)
      if (node.children.some((child) => child.id === item.id)) return false;
      return true;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // 드래그와 드롭 ref 결합
  //   const dragDropRef = (el: HTMLDivElement) => {
  //     drag(drop(el));
  //   };

  const handleToggle = () => setIsExpanded((prev) => !prev);

  // 클릭시 includedSubtreeIds 값으로 내부 디렉토리 조회 API 호출
  const handleSelect = () => {
    const categoryIds = node.includedSubtreeIds.map((id) => id).join(',');
    onSelect(categoryIds, node.id, node.breadcrumb);
  };

  // 하위 카테고리 추가 (children 내부)
  const addChildCategory = () => {
    setCategoryChildren([
      ...categoryChildren,
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
    const hasEmptyId = categoryChildren.some((category) => category.id === '');
    if (hasEmptyId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [categoryChildren]); // categoryList가 변경될 때마다 실행

  const handleInputBlur = () => {
    // blur 이벤트 발생 시 해당 요소 삭제
    setCategoryChildren(
      categoryChildren.filter((category) => category.id !== ''),
    );
    setAddCategoryInfo({ name: '', id: '' });
  };

  const confirmAddChildCategory = () => {
    onAddChildCategory?.(node.id, {
      id: addCategoryInfo.id,
      name: addCategoryInfo.name,
      children: [],
    });
  };

  return (
    <>
      <div
        ref={drop}
        className={`flex h-9 items-center px-2 cursor-pointer border-b border-b-[#E4E7EB]
            ${selectedId === node.id ? 'bg-[#F1F7FD]' : ''}
            ${isDragging ? 'opacity-50' : ''} ${isOver ? 'bg-[#F1F7FD]' : ''}`}
        style={{ paddingLeft: depth * 20 }}
        onClick={handleSelect}
      >
        {/* 펼치기/접기 아이콘 */}
        {node.children.length > 0 ? (
          <button
            className="mr-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-4 h-4 mr-1" />
        )}

        {/* 폴더 아이콘 */}
        <img className="mr-1" src={FolderIcon} alt="" />

        {/* 카테고리명 및 카운트 */}
        <p className="text-sm mr-1">
          {node.name}{' '}
          {!readonly && <span className="text-[#0066C3]">({node.count})</span>}
        </p>

        {/* 우측 액션 버튼들 */}
        {!readonly && (
          <div className="ml-auto flex gap-1">
            <button
              className="p-1 rounded hover:bg-blue-100"
              onClick={(e) => {
                e.stopPropagation();
                addChildCategory();
              }}
            >
              <PlusIcon className="w-4 cursor-pointer h-4 text-blue-500" />
            </button>
            <div
              className="p-1 rounded hover:bg-blue-100 cursor-move"
              ref={drag}
              onClick={(e) => e.stopPropagation()}
            >
              <GripHorizontal className="w-4 h-4" />
            </div>
            <button
              className="p-1 rounded hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(node.id);
              }}
            >
              <X className="w-4 cursor-pointer h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>
      {/* 하위 노드 */}
      {isExpanded && categoryChildren.length > 0 && (
        <div className="w-full">
          {categoryChildren.map((child) => {
            if (child.id) {
              return (
                <CategoryTreeNode
                  key={child.id}
                  readonly={readonly}
                  node={child}
                  depth={depth + 1}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  moveCategory={moveCategory}
                  onAddChildCategory={onAddChildCategory}
                />
              );
            }
            return (
              <div
                key={child.id}
                className="flex h-9 items-center px-2 rounded"
                style={{ marginLeft: (depth + 2) * 20 }}
              >
                <img className="mr-1" src={FolderIcon} alt="" />
                <Input
                  ref={inputRef}
                  value={addCategoryInfo.name}
                  onChange={(e) =>
                    setAddCategoryInfo({
                      name: e.target.value,
                      id: e.target.value,
                    })
                  }
                  onBlur={handleInputBlur}
                />
                <div className="ml-2 flex gap-1">
                  <button
                    className="p-1 rounded hover:bg-blue-100"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={confirmAddChildCategory}
                  >
                    <PlusIcon className="w-4 cursor-pointer h-4 text-blue-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DragPreviewImage connect={preview} src={FolderIcon} />
    </>
  );
};
