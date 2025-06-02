import RegisterCardLayout from '@/components/RegisterCardLayout';
import useCreateChatbotStore from '@/shared/hooks/useCreateChatbotStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

const MessageConfig = () => {
  // zustand state
  const {
    welcomeMessage,
    setWelcomeMessage,
    searchFailMessage,
    setSearchFailMessage,
    samplePrompts,
    setSamplePrompts,
  } = useCreateChatbotStore();
  return (
    <RegisterCardLayout title="메시지 및 샘플질문 설정">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">메시지 설정</p>
        <div className="flex gap-5">
          <p className="text-[15px] h-9 flex items-center font-medium w-[116px]">
            초기 환영 메시지*
          </p>
          <Textarea
            className="w-[380px] h-14 placeholder:text-[#98A2B2] flex-1"
            placeholder="대화의 첫 문장을 입력해주세요."
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
        </div>

        <div className="flex gap-5">
          <p className="text-[15px] h-9 flex items-center font-medium w-[116px] text-nowrap">
            검색 실패 시 메시지*
          </p>
          <Textarea
            className="w-[380px] h-14 placeholder:text-[#98A2B2] flex-1"
            placeholder="검색 결과가 없을 때의 메시지를 입력해주세요."
            value={searchFailMessage}
            onChange={(e) => setSearchFailMessage(e.target.value)}
          />
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">샘플질문 설정</p>
        <div className="flex gap-5">
          <p className="text-[15px] h-9 flex items-center font-medium w-[116px]">
            샘플질문
          </p>
          <div className="flex flex-col gap-5">
            <Button
              className="w-fit h-[36px] px-3 bg-[#667183] text-white rounded-sm text-sm font-normal"
              onClick={() => setSamplePrompts([...samplePrompts, ''])}
            >
              + 샘플질문 추가
            </Button>
            {samplePrompts.map((element, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    className="w-[388px] h-9"
                    value={element}
                    onChange={(e) =>
                      setSamplePrompts(
                        samplePrompts.map((_, i) =>
                          i === index ? e.target.value : _,
                        ),
                      )
                    }
                  />
                  <Button
                    className="h-5 px-2 bg-white border-[#E60020] text-[#E60020] text-sm font-normal"
                    onClick={() =>
                      setSamplePrompts(
                        samplePrompts.filter((_, i) => i !== index),
                      )
                    }
                  >
                    삭제
                  </Button>
                </div>
              );
            })}
            <p className="text-sm text-[#4C5667]">
              첫 질의 시 사용자에게 노출되는 샘플 질문입니다.
            </p>
          </div>
        </div>
      </div>
    </RegisterCardLayout>
  );
};

export default MessageConfig;
