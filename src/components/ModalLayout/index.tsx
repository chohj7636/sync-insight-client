import React, { useEffect } from 'react';

import { Button } from '../../shared/ui/button';

interface ModalLayoutProps {
  className?: string;
  modalWidth: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  closeModal: () => void;
  clickConfirmButton: () => void;
}

const ModalLayout = ({
  className,
  modalWidth,
  children,
  isDisabled,
  closeModal,
  clickConfirmButton,
}: ModalLayoutProps) => {
  // 모달이 열릴 때 배경 스크롤을 방지하는 효과
  useEffect(() => {
    // 모달이 열릴 때 body를 고정하고 현재 스크롤 위치를 저장
    document.body.style.cssText = `
              position: fixed;
              top: -${window.scrollY}px;
              overflow-y: scroll;
              width: 100%;`;
    return () => {
      // 모달이 닫힐 때 원래 스크롤 위치로 복원
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
      <div
        className={`rounded-md bg-white p-8 ${modalWidth} max-h-[98vh] overflow-y-auto ${className}`}
      >
        {children}
        {/* button wrapper */}
        <div className="grid w-full grid-cols-2">
          <Button
            className="h-[52px] w-[206px] justify-self-start"
            onClick={closeModal}
          >
            취소
          </Button>
          <Button
            className="h-[52px] w-[206px] justify-self-end"
            variant="blue"
            disabled={isDisabled}
            onClick={clickConfirmButton}
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
