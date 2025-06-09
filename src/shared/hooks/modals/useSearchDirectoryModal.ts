import { DirectoryListData } from '@/lib/api/datasource/type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SearchDirectoryModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  selectedOrganId: string;
  setSelectedOrganId: (selectedOrganId: string) => void;
  type: 'CATEGORY' | 'DIRECTORY';
  setType: (type: 'CATEGORY' | 'DIRECTORY') => void;
  selectedDataSource: DirectoryListData[];
  setSelectedDataSource: (selectedDataSource: DirectoryListData[]) => void;
  clickConfirmButton: (data: DirectoryListData[]) => void;
  setClickConfirmButton: (
    clickConfirmButton: (data: DirectoryListData[]) => void,
  ) => void;

  // 초기화
  resetSearchDirectoryModal: () => void;
}

const initialState = {
  isOpen: false,
};

export const useSearchDirectoryModal = create<SearchDirectoryModalState>()(
  devtools((set) => ({
    ...initialState,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    setTitle: (title: string) => set({ title }),
    setSelectedOrganId: (selectedOrganId: string) => set({ selectedOrganId }),
    setType: (type: 'CATEGORY' | 'DIRECTORY') => set({ type }),
    setSelectedDataSource: (selectedDataSource: DirectoryListData[]) =>
      set({ selectedDataSource }),
    setClickConfirmButton: (
      clickConfirmButton: (data: DirectoryListData[]) => void,
    ) => set({ clickConfirmButton }),

    resetSearchDirectoryModal: () => set(() => ({ ...initialState })),
  })),
);
