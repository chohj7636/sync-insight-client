import RegisterCardLayout from '@/components/RegisterCardLayout';
import useCreateChatbotStore, {
  PROMPT_FORMAT_LIST,
  PROMPT_STYLE_LIST,
} from '@/shared/hooks/useCreateChatbotStore';

import ChatBot from '../ChatBot';
import ReferListCard from '../ReferListCard';

const ChatBotPreview = () => {
  // zustand
  const {
    referenceList,
    retrieverType,
    retrieverCount,
    reRankedCount,
    vectorWeight,
    vectorThreshold,
    llm,
    llmOptions,
    promptOptions,
    searchFailMessage,
    organInfo,
    knowledgeBaseInfo,
    setReferenceList,
  } = useCreateChatbotStore();

  return (
    <RegisterCardLayout title="프롬프트 설정">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">프롬프트 템플릿</p>
        <PromptTemplate />

        <div className="h-[1px] w-full bg-[#E4E7EB]" />

        <p className="text-lg font-bold">채팅 서비스 미리보기</p>
        <div className="p-3 bg-[#F8F9FB] w-full flex">
          <p className="text-sm text-[#98A2B2]">
            채팅 테스트 시 설정 LLM 모델 과금정책에 따라 비용이 발생합니다.
          </p>
        </div>
        {knowledgeBaseInfo.length > 0 ? (
          <ChatBot
            previewData={{
              retrieverType: retrieverType,
              retrieverCount: Number(retrieverCount),
              reRankedCount: Number(reRankedCount),
              vectorWeight: Number(vectorWeight),
              vectorThreshold: Number(vectorThreshold),
              llm: llm.model,
              llmOptions: {
                llmTemperature: Number(llmOptions.llmTemperature),
                llmTopProbability: Number(llmOptions.llmTopProbability),
                llmMaxTokens: Number(llmOptions.llmMaxTokens),
              },
              promptOptions: promptOptions,
              searchFailMessage: searchFailMessage,
              organId: organInfo.organId,
              knowledgeBaseId: knowledgeBaseInfo[0].id,
              embedder: knowledgeBaseInfo[0].embeddingModel,
            }}
            setReferenceList={setReferenceList}
          />
        ) : (
          <div className="w-full border border-[#D0D5DD] bg-[#F6F7FA] flex items-center justify-center py-12 gap-4 rounded-md">
            <p className="text-lg text-[#98A2B2]">
              지식베이스를 업로드 해주세요.
            </p>
          </div>
        )}
        {referenceList && referenceList.length > 0 && (
          <>
            <div className="h-[1px] w-full bg-[#E4E7EB]" />

            <p className="text-lg font-bold">참고자료</p>
            <div className="w-full flex flex-col py-12 px-7 gap-5 bg-[#F6F7FA] border border-[#D0D5DD] rounded-md">
              <ReferListCard referenceList={referenceList} />
            </div>
          </>
        )}
      </div>
    </RegisterCardLayout>
  );
};

export default ChatBotPreview;

const PromptTemplate = () => {
  // zustand state
  const { promptOptions, searchFailMessage, sourceEnabledType } =
    useCreateChatbotStore();

  return (
    <div className="w-full border border-[#D0D5DD] py-6 px-3 text-sm text-[#667183] font-medium bg-[#F8F9FB]">
      <p>당신은 [{promptOptions.promptRole}]입니다.</p>
      <p>
        당신은 사용자 질문에 대해 반드시 [
        {promptOptions.promptScope === 'ONLY_KNOWLEDGE_BASE'
          ? '업로드된 지식베이스'
          : '자유생성 된 LLM'}
        ] 내 정보만을 기반으로 답변해야 합니다.
      </p>
      <p>
        답변은 [
        {
          PROMPT_STYLE_LIST.find(
            (element) => element.value === promptOptions.promptConStyle,
          )?.label
        }
        ]로 구성하되, 불확실하거나 정보가 부족할 경우에는 “[
        {searchFailMessage}]”라고 안내합니다.
      </p>
      <p>
        검색 결과가 복수일 경우, 핵심 내용을 요약하여 [
        {
          PROMPT_FORMAT_LIST.find(
            (element) => element.value === promptOptions.promptFormat,
          )?.label
        }
        ]으로 제시하십시오.
      </p>
      {sourceEnabledType === 'DISPLAY' && (
        <p>응답에는 반드시 [출처 문서명]을 함께 포함하십시오.</p>
      )}
    </div>
  );
};
