import React, { useState } from 'react';

import { downloadReferFile } from '@/lib/api/chatbot/api';
import { ReferenceFileList } from '@/lib/api/chatbot/type';
import IconDownArrow from '@/shared/icons/icon-down.svg';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

interface ReferListCardProps {
  referenceList: ReferenceFileList[];
}

const ReferListCard = ({ referenceList }: ReferListCardProps) => {
  // state
  const [activeReferIndex, setActiveReferIndex] = useState<number>();

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="w-full flex flex-col">
      {referenceList.map((element, index) => {
        return (
          <React.Fragment key={index}>
            <div
              className={`w-full justify-between rounded-md px-5 py-3 flex items-center cursor-pointer ${
                activeReferIndex === index ? 'bg-[#27303F]' : 'bg-[#667183]'
              }`}
              onClick={() => {
                setActiveReferIndex((prev) =>
                  prev === index ? undefined : index,
                );
              }}
            >
              <p className="text-xl font-bold text-white">{element.fileName}</p>
              <img
                className={`${activeReferIndex === index ? 'rotate-180' : ''}`}
                src={IconDownArrow}
                alt=""
              />
            </div>
            {activeReferIndex === index && (
              <div className="w-full rounded-md px-5 py-3 flex flex-col gap-2 bg-white max-h-[300px] overflow-y-auto mt-5 border border-[#D0D5DD]">
                <p className="text-lg font-medium text-wrap">
                  {formatText(element.pageContents)}
                </p>
                <Button
                  className="border-[#E4E7EB] px-3 w-fit h-7"
                  onClick={async () => {
                    try {
                      const blob = await downloadReferFile(
                        element.fileDownloadUrl,
                      );
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', element.fileName); // 원본 파일명으로 다운로드
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      toast('파일 다운로드 중 오류가 발생했습니다.', {
                        duration: 2000,
                        position: 'top-center',
                      });
                    }
                  }}
                >
                  새창열기
                </Button>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ReferListCard;
