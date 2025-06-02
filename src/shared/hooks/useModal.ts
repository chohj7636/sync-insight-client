import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalInfoState {
  title: string | JSX.Element;
  description: string | JSX.Element;
  status?: 'success' | 'error' | 'warning' | 'info';
  info?: string[];
  eventButton?: {
    title: string;
    clickEvent: () => void;
  };
  cancelButton?: {
    title: string;
    clickEvent: () => void;
  };
  confirmEvent?: () => void; // 기본 '확인' 버튼을 클릭했을때 동작할 이벤트 함수
}

interface ModalState {
  modalInfo: ModalInfoState | null; // 모달 정보
  modal: (val: ModalInfoState) => void; // 모달을 호출하는 hook
  modalClose: () => void;
}

const useModal = create<ModalState>()(
  devtools((set) => ({
    modalInfo: null,
    modal: (val) =>
      set(() => ({
        modalInfo: val,
      })),
    modalClose: () => set({ modalInfo: null }),
  })),
);

export default useModal;
