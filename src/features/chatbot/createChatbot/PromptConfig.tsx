import ActiveRadioIcon from '@/assets/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/assets/icons/icon-inactiveRadio.svg';
import DefaultSelect from '@/components/DefaultSelect';
import RegisterCardLayout from '@/components/RegisterCardLayout';
import { Input } from '@/components/ui/input';
import useCreateChatbotStore, {
  PROMPT_FORMAT_LIST,
  PROMPT_SCOPE_LIST,
  PROMPT_STYLE_LIST,
  SOURCE_ENABLED_TYPE_LIST,
} from '@/hooks/useCreateChatbotStore';
import { CreateChatBotParams, PromptOptions } from '@/lib/api/chatbot/type';

const PromptConfig = () => {
  // zustand
  const {
    promptOptions,
    setPromptOptions,
    sourceEnabledType,
    setSourceEnabledType,
  } = useCreateChatbotStore();

  return (
    <RegisterCardLayout title="프롬프트 설정">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">서비스 역할 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">서비스 역할*</p>
          <Input
            className="w-[380px] h-9 placeholder:text-[#98A2B2]"
            placeholder="ex. 산업안전 교육 전문가, A 연구 분석 전문가"
            value={promptOptions.promptRole}
            onChange={(e) =>
              setPromptOptions({
                ...promptOptions,
                promptRole: e.target.value,
              })
            }
          />
        </div>

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">대화체 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">대화제</p>
          <DefaultSelect
            className="h-[36px] w-[180px] rounded-sm bg-white"
            selectList={PROMPT_STYLE_LIST}
            defaultValue={promptOptions.promptConStyle}
            setValue={(value) =>
              setPromptOptions({
                ...promptOptions,
                promptConStyle: value as PromptOptions['promptConStyle'],
              })
            }
          />
        </div>
        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">응답 형식 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">응답형식</p>
          <div className="flex items-center gap-5">
            {PROMPT_FORMAT_LIST.map((element) => {
              return (
                <div
                  key={element.label}
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() =>
                    setPromptOptions({
                      ...promptOptions,
                      promptFormat:
                        element.value as PromptOptions['promptFormat'],
                    })
                  }
                >
                  <img
                    src={
                      element.value === promptOptions.promptFormat
                        ? ActiveRadioIcon
                        : InactiveRadioIcon
                    }
                    alt=""
                  />
                  <p className="text-[15px] font-medium">{element.label}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">지식 범위 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">지식 범위</p>
          {PROMPT_SCOPE_LIST.map((element) => {
            return (
              <div
                key={element.label}
                className="flex items-center gap-1 cursor-pointer"
                onClick={() =>
                  setPromptOptions({
                    ...promptOptions,
                    promptScope: element.value as PromptOptions['promptScope'],
                  })
                }
              >
                <img
                  src={
                    element.value === promptOptions.promptScope
                      ? ActiveRadioIcon
                      : InactiveRadioIcon
                  }
                  alt=""
                />
                <p className="text-[15px] font-medium">{element.label}</p>
              </div>
            );
          })}
        </div>
        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">출처 표시 설정</p>
        <div className="flex gap-5">
          <p className="text-[15px] font-medium w-[116px] h-5 flex items-center">
            출처
          </p>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              {SOURCE_ENABLED_TYPE_LIST.map((element) => {
                return (
                  <div
                    key={element.label}
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setSourceEnabledType(
                        element.value as CreateChatBotParams['sourceEnabledType'],
                      )
                    }
                  >
                    <img
                      src={
                        element.value === sourceEnabledType
                          ? ActiveRadioIcon
                          : InactiveRadioIcon
                      }
                      alt=""
                    />
                    <p className="text-[15px] font-medium">{element.label}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-[#4C5667]">
              출처 표시 설정 시 “출처: OOO문서" 로 표시되며, 원문 바로보기
              기능을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </RegisterCardLayout>
  );
};

export default PromptConfig;
