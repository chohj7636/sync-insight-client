import { CategoryList } from '@/entities/categoryList/api/type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface targetDirListState {
  id: string;
  dirName: string;
  categoryBreadcrumb: string;
}

interface ChangeCategoryModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  organId: string;
  setOrganId: (organId: string) => void;
  targetDirList: targetDirListState[];
  setTargetDirList: (targetDirList: targetDirListState[]) => void;
  categoryList: CategoryList[];
  setCategoryList: (categoryList: CategoryList[]) => void;
  categoryId: string;
  setCategoryId: (categoryId: string) => void;
  categoryBreadcrumb: string;
  setCategoryBreadcrumb: (categoryBreadcrumb: string) => void;
  refetch: () => void;
  setRefetch: (refetch: () => void) => void;

  // 초기화
  resetChangeCategoryModal: () => void;
}

const initialState = {
  isOpen: false,
  organId: '',
  targetDirList: [],
  categoryList: [],
  categoryId: '',
  categoryBreadcrumb: '',
};

export const useChangeCategoryModal = create<ChangeCategoryModalState>()(
  devtools((set) => ({
    ...initialState,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    setOrganId: (organId: string) => set({ organId }),
    setTargetDirList: (targetDirList: targetDirListState[]) =>
      set({ targetDirList }),
    setCategoryList: (categoryList: CategoryList[]) => set({ categoryList }),
    setCategoryId: (categoryId: string) => set({ categoryId }),
    setCategoryBreadcrumb: (categoryBreadcrumb: string) =>
      set({ categoryBreadcrumb }),
    refetch: () => {},
    setRefetch: (refetch: () => void) => set({ refetch }),

    resetChangeCategoryModal: () => set(() => ({ ...initialState })),
  })),
);
