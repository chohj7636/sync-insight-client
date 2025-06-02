import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DirStoreState {
  selectedDirId: string;
  setSelectedDirId: (val: string) => void;
}

const useDirStore = create<DirStoreState>()(
  devtools((set) => ({
    // selectedDirId: '',
    selectedDirId: 'f0cb4b54-31fd-46f4-b38d-051ec074f603', // Test Data 회원사명: 테스트
    setSelectedDirId: (val) =>
      set(() => ({
        selectedDirId: val,
      })),
  })),
);

export default useDirStore;
