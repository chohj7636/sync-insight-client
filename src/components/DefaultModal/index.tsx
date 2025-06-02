import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import useModal from '@/hooks/useModal';

import { Button } from '../ui/button';

/**
 * DefaultModal 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션에서 사용되는 기본 모달 창을 렌더링합니다.
 * useModal 훅을 사용하여 모달의 상태를 관리하고 제어합니다.
 */
const DefaultModal = () => {
  const { modalInfo, modalClose } = useModal();

  const printButtonGroup = () => {
    // eventButton이 존재하면 '취소하기'와 사용자 정의 버튼을 렌더링
    if (modalInfo?.eventButton) {
      return (
        <>
          <Button
            className="h-[52px] rounded-[8px] text-[15px] font-bold"
            onClick={modalInfo.cancelButton?.clickEvent ?? modalClose}
          >
            {modalInfo.cancelButton?.title ?? '취소'}
          </Button>
          <Button
            className="h-[52px] rounded-[8px]"
            variant="blue"
            onClick={modalInfo.eventButton.clickEvent}
          >
            {modalInfo.eventButton?.title}
          </Button>
        </>
      );
    }
    // eventButton이 없으면 기본 '확인' 버튼만 렌더링
    return (
      <Button
        className="h-[36px] w-[100px] rounded-lg text-[18px] font-bold text-white"
        onClick={() => {
          if (modalInfo?.confirmEvent) {
            modalInfo.confirmEvent();
          }
          modalClose();
        }}
      >
        확인
      </Button>
    );
  };

  const printBody = () => {
    if (!modalInfo) return null;
    if (modalInfo?.status === 'info') {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p className="text-lg font-bold text-[#0066C3]">{modalInfo.title}</p>
          {modalInfo.info && (
            <div className="w-full rounded-sm bg-[#F8F9FB] p-3 text-[14px] text-[#98A2B2]">
              {modalInfo.info.map((element) => {
                return <p key={element}>{element}</p>;
              })}
            </div>
          )}
          <p className="text-[15px] font-medium text-[#4C5667] text-center">
            {renderDescription()}
          </p>
        </div>
      );
    }
    return (
      <div className="flex w-full">
        <div className="w-4/5">
          <p className="mb-[10px] text-[16px] leading-[normal] font-bold">
            {modalInfo.title}
          </p>
          <div className="max-h-[80px] overflow-y-auto text-[16px]">
            {renderDescription()}
          </div>
        </div>
      </div>
    );
  };

  // 모달이 열릴 때 배경 스크롤을 방지하는 효과
  useEffect(() => {
    if (modalInfo) {
      // 모달이 열릴 때 body를 고정하고 현재 스크롤 위치를 저장
      document.body.style.cssText = `
                position: fixed;
                top: -${window.scrollY}px;
                overflow-y: scroll;
                width: 100%;`;
    } else {
      // 모달이 닫힐 때 원래 스크롤 위치로 복원
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  }, [modalInfo]);

  const renderDescription = () => {
    if (typeof modalInfo?.description === 'string') {
      return modalInfo.description.split('\n').map((line, index) => (
        <span key={index} className="block text-[16px]">
          {line}
        </span>
      ));
    }
    return modalInfo?.description;
  };

  return modalInfo
    ? createPortal(
        <div className="fixed top-0 left-0 z-[9999] h-screen w-full bg-[rgba(0,0,0,0.6)]">
          <div
            id="modal-layout"
            className="fixed top-1/2 left-1/2 flex w-[460px] translate-x-[-50%] translate-y-[-50%] flex-col justify-between rounded-[8px] bg-white px-5 pt-10 pb-8"
          >
            {printBody()}

            <div className="mt-8 grid grid-cols-2 gap-2">
              {printButtonGroup()}
            </div>
          </div>
        </div>,
        document.getElementById('default-modal') as HTMLElement,
      )
    : null;
};

export default DefaultModal;
