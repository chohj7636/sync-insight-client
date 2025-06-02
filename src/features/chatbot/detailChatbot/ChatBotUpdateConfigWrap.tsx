import { useState } from 'react';

import {
  getLLMModelListApi,
  updateChatBotLLMConfigApi,
  updateChatBotPromptConfigApi,
  updateRetrieverConfigApi,
} from '@/lib/api/chatbot/api';
import {
  ChatBotDetailInfo,
  CreateChatBotParams,
  PromptOptions,
} from '@/lib/api/chatbot/type';
import ConfigCardLayout from '@/shared/components/ConfigCardLayout';
import DefaultSelect from '@/shared/components/DefaultSelect';
import { DefaultTable } from '@/shared/components/DefaultTable';
import ModalLayout from '@/shared/components/ModalLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  KEYWORD_MATCH_TYPE_LIST,
  PROMPT_FORMAT_LIST,
  PROMPT_SCOPE_LIST,
  PROMPT_STYLE_LIST,
  RETRIEVER_TYPE_LIST,
  SOURCE_ENABLED_TYPE_LIST,
} from '@/shared/hooks/useCreateChatbotStore';
import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import IconActiveRadio from '@/shared/icons/icon-grayActiveRadio.svg';
import IconInactiveRadio from '@/shared/icons/icon-inactiveRadio.svg';
import IconSetting from '@/shared/icons/icon-setting.svg';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ChatBotUpdateConfigWrapProps {
  ChatbotDetailData: ChatBotDetailInfo;
  refetchDetail: () => void;
}

const ChatBotUpdateConfigWrap = ({
  ChatbotDetailData,
  refetchDetail,
}: ChatBotUpdateConfigWrapProps) => {
  // state
  const [openRetrieverSettingModal, setOpenRetrieverSettingModal] =
    useState(false);
  const [openLLMSettingModal, setOpenLLMSettingModal] = useState(false);
  const [openPromptConfigModal, setOpenPromptConfigModal] = useState(false);

  return (
    <div className="w-full grid grid-cols-3 gap-5">
      <ConfigCardLayout
        title="검색기(리트리버) 설정"
        optionButton={
          <img
            className="cursor-pointer"
            src={IconSetting}
            alt="setting"
            onClick={() => setOpenRetrieverSettingModal(true)}
          />
        }
      >
        <div className="flex flex-col w-full p-3 gap-2 bg-[#F8F9FB] flex-1">
          <TextBox
            title="리트리버 유형"
            value={
              RETRIEVER_TYPE_LIST.find(
                (item) => item.value === ChatbotDetailData.retrieverType,
              )?.label
            }
          />
          <TextBox
            title="검색 결과 수(Top-K)"
            value={ChatbotDetailData.retrieverCount}
          />
          <TextBox
            title="재정렬 결과 수"
            value={ChatbotDetailData.reRankedCount}
          />
          <TextBox
            title="최소 유사도 임계값"
            value={ChatbotDetailData.vectorThreshold}
          />
          {ChatbotDetailData.retrieverType === 'HYBRID' && (
            <TextBox
              title="벡터 가중치"
              value={ChatbotDetailData.vectorWeight}
            />
          )}
          {ChatbotDetailData.retrieverType !== 'SEMANTIC' && (
            <TextBox
              title="키워드 일치 방식"
              value={
                ChatbotDetailData.keywordMatchType === 'EXACT_MATCH'
                  ? '정확히 일치'
                  : '부분 일치'
              }
            />
          )}
        </div>
      </ConfigCardLayout>
      {openRetrieverSettingModal && (
        <RetrieverSettingModal
          chatbotId={ChatbotDetailData.id}
          retrieverType={ChatbotDetailData.retrieverType}
          retrieverCount={ChatbotDetailData.retrieverCount}
          reRankedCount={ChatbotDetailData.reRankedCount}
          vectorThreshold={ChatbotDetailData.vectorThreshold}
          vectorWeight={ChatbotDetailData.vectorWeight}
          keywordMatchType={ChatbotDetailData.keywordMatchType}
          closeModal={() => setOpenRetrieverSettingModal(false)}
          refetchDetail={refetchDetail}
        />
      )}

      <ConfigCardLayout
        title="LLM 모델 및 옵션 설정"
        optionButton={
          <img
            className="cursor-pointer"
            src={IconSetting}
            alt="setting"
            onClick={() => setOpenLLMSettingModal(true)}
          />
        }
      >
        <div className="flex flex-col w-full p-3 gap-2 h-[300px] bg-[#F8F9FB] flex-1">
          <TextBox title="LLM 기반 모델" value={ChatbotDetailData.llm} />
          <TextBox
            title="온도(Temperature)"
            value={ChatbotDetailData.llmOptions.llmTemperature}
          />
          <TextBox
            title="Top-p샘플링"
            value={ChatbotDetailData.llmOptions.llmTopProbability}
          />
          <TextBox
            title="Max_tokens(최대응답길이)"
            value={ChatbotDetailData.llmOptions.llmMaxTokens}
          />
        </div>
      </ConfigCardLayout>
      {openLLMSettingModal && (
        <LLMSettingModal
          chatbotId={ChatbotDetailData.id}
          llmModel={ChatbotDetailData.llm}
          llmOptions={ChatbotDetailData.llmOptions}
          closeModal={() => setOpenLLMSettingModal(false)}
          refetchDetail={refetchDetail}
        />
      )}

      <ConfigCardLayout
        title="프롬프트 설정"
        optionButton={
          <img
            className="cursor-pointer"
            src={IconSetting}
            alt="setting"
            onClick={() => setOpenPromptConfigModal(true)}
          />
        }
      >
        <div className="flex flex-col w-full p-3 gap-2 h-[300px] bg-[#F8F9FB] flex-1">
          <TextBox
            title="서비스 역할"
            value={ChatbotDetailData.promptOptions.promptRole}
          />
          <TextBox
            title="대화체"
            value={
              PROMPT_STYLE_LIST.find(
                (item) =>
                  item.value === ChatbotDetailData.promptOptions.promptConStyle,
              )?.label
            }
          />
          <div className="flex flex-col gap-1 text-[15px]">
            <p className="font-medium">응답형식 설정</p>
            <div className="flex items-center gap-1">
              {PROMPT_FORMAT_LIST.map((item) => (
                <div key={item.value} className="flex items-center gap-1">
                  <img
                    src={
                      item.value ===
                      ChatbotDetailData.promptOptions.promptFormat
                        ? IconActiveRadio
                        : IconInactiveRadio
                    }
                    alt=""
                  />
                  <p
                    className={` ${
                      item.value ===
                      ChatbotDetailData.promptOptions.promptFormat
                        ? 'font-bold'
                        : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[15px]">
            <p className="font-medium">지식 범위</p>
            <div className="flex items-center gap-1">
              {PROMPT_SCOPE_LIST.map((item) => (
                <div key={item.value} className="flex items-center gap-1">
                  <img
                    src={
                      item.value === ChatbotDetailData.promptOptions.promptScope
                        ? IconActiveRadio
                        : IconInactiveRadio
                    }
                  />
                  <p
                    className={` ${
                      item.value === ChatbotDetailData.promptOptions.promptScope
                        ? 'font-bold'
                        : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[15px]">
            <p className="font-medium">출처</p>
            <div className="flex items-center gap-1">
              {SOURCE_ENABLED_TYPE_LIST.map((item) => (
                <div key={item.value} className="flex items-center gap-1">
                  <img
                    src={
                      item.value === ChatbotDetailData.sourceEnabledType
                        ? IconActiveRadio
                        : IconInactiveRadio
                    }
                  />
                  <p
                    className={` ${
                      item.value === ChatbotDetailData.sourceEnabledType
                        ? 'font-bold'
                        : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ConfigCardLayout>
      {openPromptConfigModal && (
        <PromptConfigModal
          chatbotId={ChatbotDetailData.id}
          promptOptions={ChatbotDetailData.promptOptions}
          sourceEnabledType={ChatbotDetailData.sourceEnabledType}
          closeModal={() => setOpenPromptConfigModal(false)}
          refetchDetail={refetchDetail}
        />
      )}
    </div>
  );
};

const TextBox = ({
  title,
  value,
}: {
  title: string;
  value: string | number | undefined;
}) => {
  return (
    <div className="flex flex-col gap-1 text-[15px]">
      <p className="font-medium">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
};

// 리트리버 설정 모달
interface RetrieverSettingModalProps {
  chatbotId: string;
  retrieverType: ChatBotDetailInfo['retrieverType'];
  retrieverCount: ChatBotDetailInfo['retrieverCount'];
  reRankedCount: ChatBotDetailInfo['reRankedCount'];
  vectorThreshold: ChatBotDetailInfo['vectorThreshold'];
  vectorWeight: ChatBotDetailInfo['vectorWeight'];
  keywordMatchType: ChatBotDetailInfo['keywordMatchType'];
  closeModal: () => void;
  refetchDetail: () => void;
}

const RetrieverSettingModal = ({
  chatbotId,
  retrieverType,
  retrieverCount,
  reRankedCount,
  vectorThreshold,
  vectorWeight,
  keywordMatchType,
  closeModal,
  refetchDetail,
}: RetrieverSettingModalProps) => {
  // state
  const [updateRetrieverType, setUpdateRetrieverType] = useState(retrieverType);
  const [updateRetrieverCount, setUpdateRetrieverCount] = useState(
    retrieverCount.toString(),
  );
  const [updateReRankedCount, setUpdateReRankedCount] = useState(
    reRankedCount.toString(),
  );
  const [updateVectorThreshold, setUpdateVectorThreshold] = useState(
    vectorThreshold.toString(),
  );
  const [updateVectorWeight, setUpdateVectorWeight] = useState(
    vectorWeight.toString(),
  );
  const [updateKeywordMatchType, setUpdateKeywordMatchType] =
    useState(keywordMatchType);

  // 리트리버 설정 변경 query
  const { mutate: updateRetrieverConfig } = useMutation({
    mutationFn: updateRetrieverConfigApi,
    onSuccess: () => {
      toast.success('리트리버 설정이 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetchDetail();
      closeModal();
    },
    onError: () => {
      toast.error('리트리버 설정 변경에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const changeRetrieverInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // 숫자와 소수점만 허용하는 정규식
    const numericValue = value.replace(/[^0-9.]/g, '');

    // 소수점이 여러 개인 경우 처리
    const parts = numericValue.split('.');
    const formattedValue =
      parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join('')}`
        : numericValue;

    switch (name) {
      case 'retrieverCount':
        setUpdateRetrieverCount(formattedValue);
        break;
      case 'reRankedCount':
        setUpdateReRankedCount(formattedValue);
        break;
      case 'vectorThreshold':
        setUpdateVectorThreshold(formattedValue);
        break;
      case 'vectorWeight':
        setUpdateVectorWeight(formattedValue);
        break;
      default:
        break;
    }
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => {
        updateRetrieverConfig({
          chatbotId: chatbotId,
          retrieverType: updateRetrieverType,
          retrieverCount: Number(updateRetrieverCount),
          reRankedCount: Number(updateReRankedCount),
          vectorThreshold: Number(updateVectorThreshold),
          vectorWeight: Number(updateVectorWeight),
          keywordMatchType: updateKeywordMatchType,
        });
      }}
    >
      <p className="text-2xl mb-6 font-bold">검색기(리트리버) 설정</p>
      <div className="flex flex-col gap-4 mb-10">
        <p className="text-lg font-bold">리트리버 유형</p>
        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-medium">유사도 측정 방식</p>
          <div
            id="button-wrap"
            className="flex h-7 rounded-sm border border-[#E4E7EB] w-fit"
          >
            {RETRIEVER_TYPE_LIST.map((element) => {
              return (
                <Button
                  key={element.value}
                  className={`h-full w-[134px] rounded-sm border-2 text-sm ${
                    updateRetrieverType === element.value
                      ? 'border-[#0066C3] bg-[#F1F7FD] text-[#0066C3]'
                      : 'border-white bg-white'
                  }`}
                  onClick={() =>
                    setUpdateRetrieverType(
                      element.value as ChatBotDetailInfo['retrieverType'],
                    )
                  }
                >
                  {element.label}
                </Button>
              );
            })}
          </div>
        </div>
        <DefaultTable
          headerList={[
            { key: 'type', label: '리트리버 유형' },
            { key: 'description', label: '설명' },
            { key: 'feature', label: '특징' },
          ]}
          data={[
            {
              type: '의미 기반 검색(Semantic/Cosine)',
              description: '문장 전체의 의미 유사도를 기준으로 문서 검색',
              feature: '유연하고 문맥 중심, 정확한 단어가 없어도 검색 가능',
            },
            {
              type: '키워드 기반 검색 (Lexical)',
              description: '질문 내 키워드와 일치하는 문서를 검색',
              feature: '빠르고 명확, 키워드 일치 중심, 단어 정확성 요구',
            },
            {
              type: '하이브리드 검색 (Hybrid)',
              description:
                '의미 기반 + 키워드 기반 검색을 가중치로 조합하여 검색',
              feature: '유연성과 정밀도 모두 확보 가능',
            },
          ]}
        />

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-lg font-bold">리트리버 설정 값</p>

        <div className="w-full p-3 bg-[#F8F9FB] rounded-sm flex items-center gap-2">
          <div className="border border-[#D0D5DD] bg-white text-sm text-primary px-3 h-7 rounded-sm flex items-center">
            권장옵션
          </div>
          {updateRetrieverType === 'SEMANTIC' ? (
            <div className="flex flex-col gap-1 text-sm text-[#98A2B2]">
              <p>✅ 검색 결과 수(Top-K): 5~10</p>
              <p>✅ 최소 유사도 임계값: 0.75</p>
            </div>
          ) : updateRetrieverType === 'KEYWORD' ? (
            <div className="flex flex-col gap-1 text-sm text-[#98A2B2]">
              <p>✅ 검색 결과 수(Top-K): 5~10</p>
            </div>
          ) : (
            <div className="flex-1">
              <DefaultTable
                headerStyle="bg-[#667183] [&_th]:text-white"
                bodyStyle="bg-white"
                headerList={[
                  { key: 'purpose', label: '목적' },
                  { key: 'topK', label: 'Top-K' },
                  { key: 'similarityThreshold', label: '유사도 임계값' },
                  { key: 'weight', label: '키워드 가중치' },
                  { key: 'note', label: '비고' },
                ]}
                data={[
                  {
                    purpose: '빠른 검색',
                    topK: '3',
                    similarityThreshold: '0.7',
                    weight: '0.2',
                    note: '속도 우선 시스템',
                  },
                  {
                    purpose: '정확도 높은 검색',
                    topK: '10',
                    similarityThreshold: '0.8',
                    weight: '0.4',
                    note: '회의록, 보고서 검색',
                  },
                  {
                    purpose: '자연어 질의 대응 강화',
                    topK: '5',
                    similarityThreshold: '0.75',
                    weight: '0.5',
                    note: 'QnA 서비스 등',
                  },
                ]}
              />
            </div>
          )}
        </div>

        <p className="text-lg font-bold">기본 설정 항목</p>
        <div className="flex flex-col gap-4">
          <InputWrapper
            label="검색 결과 수(Top-K)"
            inputName="retrieverCount"
            suggestion="최소값 1~최대값 50"
            value={updateRetrieverCount}
            onChangeInput={changeRetrieverInput}
          />

          <InputWrapper
            label="재정렬 결과 수"
            inputName="reRankedCount"
            suggestion="최소값 1~최대값 Top-K 수"
            value={updateReRankedCount}
            onChangeInput={changeRetrieverInput}
          />

          <InputWrapper
            label="최소 유사도 임계값"
            inputName="vectorThreshold"
            suggestion="최소값 0.0~최대값 1.0"
            value={updateVectorThreshold}
            onChangeInput={changeRetrieverInput}
          />
          {updateRetrieverType === 'HYBRID' && (
            <InputWrapper
              label="벡터 가중치"
              inputName="vectorWeight"
              suggestion="최소값 0.0~최대값 1.0"
              value={updateVectorWeight}
              onChangeInput={changeRetrieverInput}
            />
          )}
          {updateRetrieverType !== 'SEMANTIC' && (
            <div className="flex items-center gap-5">
              <p className="w-[120px] text-sm">키워드 일치 방식</p>
              <div className="flex items-center gap-5">
                {KEYWORD_MATCH_TYPE_LIST.map((element) => {
                  return (
                    <div
                      key={element.value}
                      className="flex gap-1 items-center cursor-pointer"
                      onClick={() =>
                        setUpdateKeywordMatchType(
                          element.value as ChatBotDetailInfo['keywordMatchType'],
                        )
                      }
                    >
                      <img
                        src={
                          updateKeywordMatchType === element.value
                            ? ActiveRadioIcon
                            : IconInactiveRadio
                        }
                        alt=""
                      />
                      <p className="text-sm font-medium">{element.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalLayout>
  );
};

const LLMSettingModal = ({
  chatbotId,
  llmModel,
  llmOptions,
  closeModal,
  refetchDetail,
}: {
  chatbotId: string;
  llmModel: string;
  llmOptions: ChatBotDetailInfo['llmOptions'];
  closeModal: () => void;
  refetchDetail: () => void;
}) => {
  // state
  const [updateLLMModel, setUpdateLLMModel] = useState(llmModel);
  const [updateTemperature, setUpdateTemperature] = useState(
    llmOptions.llmTemperature.toString(),
  );
  const [updateTopProbability, setUpdateTopProbability] = useState(
    llmOptions.llmTopProbability.toString(),
  );
  const [updateMaxTokens, setUpdateMaxTokens] = useState(
    llmOptions.llmMaxTokens.toString(),
  );

  // LLM 모델 조회 query
  const { data: llmModelList } = useQuery({
    queryKey: ['llmModelList'],
    queryFn: getLLMModelListApi,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // LLM 설정 변경 query
  const { mutate: updateChatBotLLMConfig } = useMutation({
    mutationFn: updateChatBotLLMConfigApi,
    onSuccess: () => {
      toast.success('LLM 설정이 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetchDetail();
      closeModal();
    },
    onError: () => {
      toast.error('LLM 설정 변경에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const changeTemperatureInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    // 숫자와 소수점만 허용하는 정규식
    const numericValue = value.replace(/[^0-9.]/g, '');

    // 소수점이 여러 개인 경우 처리
    const parts = numericValue.split('.');
    const formattedValue =
      parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join('')}`
        : numericValue;

    switch (name) {
      case 'llmTemperature':
        setUpdateTemperature(formattedValue);
        break;
      case 'llmTopProbability':
        setUpdateTopProbability(formattedValue);
        break;
      case 'llmMaxTokens':
        setUpdateMaxTokens(formattedValue);
        break;
      default:
        break;
    }
  };

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => {
        updateChatBotLLMConfig({
          chatbotId,
          llm: updateLLMModel,
          llmTemperature: Number(updateTemperature),
          llmTopProbability: Number(updateTopProbability),
          llmMaxTokens: Number(updateMaxTokens),
        });
      }}
    >
      <p className="text-2xl mb-6 font-bold">LLM 모델 및 옵션 설정</p>
      <div className="flex flex-col gap-4 mb-10">
        <p className="text-lg font-bold">LLM 기반 모델</p>
        <div className="flex items-center gap-5">
          <p className="text-sm font-medium w-[116px]">선택 모델</p>
          {llmModelList && (
            <DefaultSelect
              className="h-[36px] w-[180px] rounded-sm bg-white"
              selectList={llmModelList.map((item) => ({
                label: item.displayName,
                value: item.model,
              }))}
              defaultValue={updateLLMModel}
              setValue={(value) => setUpdateLLMModel(value as string)}
            />
          )}
        </div>

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-xl font-bold">LLM 옵션 설정</p>
        <p className="text-lg font-bold">온도(Temperature)</p>
        <DefaultTable
          headerStyle="bg-[#667183] [&_th]:text-white [&_th]:h-7"
          bodyStyle="bg-white h-7 [&_td]:py-0"
          headerList={[
            { key: 'range', label: '값 범위' },
            { key: 'meaning', label: '의미' },
          ]}
          data={[
            {
              range: '0.0',
              meaning: '완전히 결정적(항상 같은 답변 제공)',
            },
            {
              range: '0.2~0.5',
              meaning: '안정적, 정밀한 답변 (문서 요약, 정책 설명 등)',
            },
            {
              range: '0.7~1.0',
              meaning:
                '창의적, 유연한 답변 (스토리, 아이디어, 브레인스토밍 등)',
            },
            {
              range: '1.0 이상',
              meaning: '매우 다양하지만 무의미한 답변 가능성',
            },
          ]}
        />
        <p className="text-sm text-[#4C5667]">
          top_p는 temperature와 상호보완적이므로 둘 중 하나만 적극적으로
          조절하는 것이 좋습니다.
        </p>
        <InputWrapper
          label="온도(Temperature)"
          inputName="llmTemperature"
          suggestion="최소값 0.0~최대값 1.0"
          value={updateTemperature}
          onChangeInput={changeTemperatureInput}
        />
        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-lg font-bold">Top-p 샘플링</p>
        <DefaultTable
          headerStyle="bg-[#667183] [&_th]:text-white [&_th]:h-7"
          bodyStyle="bg-white h-7 [&_td]:py-0"
          headerList={[
            { key: 'range', label: '값 범위' },
            { key: 'meaning', label: '의미' },
          ]}
          data={[
            {
              range: '0.0~0.5',
              meaning: '매우 제한적, 반복적일 수 있음',
            },
            {
              range: '0.8',
              meaning: '상위 80% 확률 단어 중에서 선택',
            },
            {
              range: '1.0',
              meaning: '모든 단어 포함(=랜덤성 증가)',
            },
          ]}
        />
        <InputWrapper
          label="Top-p 샘플링"
          inputName="llmTopProbability"
          suggestion="최소값 0.0~최대값 1.0"
          value={updateTopProbability}
          onChangeInput={changeTemperatureInput}
        />

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-lg font-bold">Max_tokens(최대 응답 길이)</p>
        <DefaultTable
          headerStyle="bg-[#667183] [&_th]:text-white [&_th]:h-7"
          bodyStyle="bg-white h-7 [&_td]:py-0"
          headerList={[
            { key: 'range', label: '값 범위' },
            { key: 'meaning', label: '의미' },
          ]}
          data={[
            {
              range: '50~100',
              meaning: '짧은 요약, 간단 응답',
            },
            {
              range: '200~500',
              meaning: '표준형 문장 응답',
            },
            {
              range: '1000+',
              meaning: '장문, 보고서, 자세한 설명',
            },
          ]}
        />
        <InputWrapper
          label="Max_tokens(최대 응답 길이)"
          inputName="llmMaxTokens"
          suggestion="최소값 50자~최대값 2,000자"
          value={updateMaxTokens}
          onChangeInput={changeTemperatureInput}
        />
      </div>
    </ModalLayout>
  );
};

const PromptConfigModal = ({
  chatbotId,
  promptOptions,
  sourceEnabledType,
  closeModal,
  refetchDetail,
}: {
  chatbotId: string;
  promptOptions: ChatBotDetailInfo['promptOptions'];
  sourceEnabledType: ChatBotDetailInfo['sourceEnabledType'];
  closeModal: () => void;
  refetchDetail: () => void;
}) => {
  // state
  const [updatePromptRole, setUpdatePromptRole] = useState(
    promptOptions.promptRole,
  );
  const [updatePromptConStyle, setUpdatePromptConStyle] = useState(
    promptOptions.promptConStyle,
  );
  const [updatePromptFormat, setUpdatePromptFormat] = useState(
    promptOptions.promptFormat,
  );
  const [updatePromptScope, setUpdatePromptScope] = useState(
    promptOptions.promptScope,
  );
  const [updateSourceEnabledType, setUpdateSourceEnabledType] =
    useState(sourceEnabledType);

  // 프롬프트 설정 변경 query
  const { mutate: updateChatBotPromptConfig } = useMutation({
    mutationFn: updateChatBotPromptConfigApi,
    onSuccess: () => {
      toast.success('프롬프트 설정이 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetchDetail();
      closeModal();
    },
    onError: () => {
      toast.error('프롬프트 설정 변경에 실패했습니다.', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return (
    <ModalLayout
      modalWidth="w-[580px]"
      closeModal={closeModal}
      clickConfirmButton={() => {
        updateChatBotPromptConfig({
          chatbotId,
          promptRole: updatePromptRole,
          promptConStyle: updatePromptConStyle,
          promptFormat: updatePromptFormat,
          promptScope: updatePromptScope,
          sourceEnabledType: updateSourceEnabledType,
        });
      }}
    >
      <p className="text-2xl mb-6 font-bold">프롬프트 설정</p>
      <div className="flex flex-col gap-4 mb-10">
        <p className="text-lg font-bold">서비스 역할 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">서비스 역할*</p>
          <Input
            className="w-[380px] h-9 placeholder:text-[#98A2B2]"
            placeholder="ex. 산업안전 교육 전문가, A 연구 분석 전문가"
            value={updatePromptRole}
            onChange={(e) => setUpdatePromptRole(e.target.value)}
          />
        </div>

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-lg font-bold">대화체 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">대화제</p>
          <DefaultSelect
            className="h-[36px] w-[180px] rounded-sm bg-white"
            selectList={PROMPT_STYLE_LIST}
            defaultValue={updatePromptConStyle}
            setValue={(value) =>
              setUpdatePromptConStyle(value as PromptOptions['promptConStyle'])
            }
          />
        </div>
        <div className="h-[1px] w-full bg-[#D0D5DD]" />

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
                    setUpdatePromptFormat(
                      element.value as PromptOptions['promptFormat'],
                    )
                  }
                >
                  <img
                    src={
                      element.value === updatePromptFormat
                        ? ActiveRadioIcon
                        : IconInactiveRadio
                    }
                    alt=""
                  />
                  <p className="text-[15px] font-medium">{element.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-lg font-bold">지식 범위 설정</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] font-medium w-[116px]">지식 범위</p>
          {PROMPT_SCOPE_LIST.map((element) => {
            return (
              <div
                key={element.label}
                className="flex items-center gap-1 cursor-pointer"
                onClick={() =>
                  setUpdatePromptScope(
                    element.value as PromptOptions['promptScope'],
                  )
                }
              >
                <img
                  src={
                    element.value === updatePromptScope
                      ? ActiveRadioIcon
                      : IconInactiveRadio
                  }
                  alt=""
                />
                <p className="text-[15px] font-medium">{element.label}</p>
              </div>
            );
          })}
        </div>

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

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
                      setUpdateSourceEnabledType(
                        element.value as CreateChatBotParams['sourceEnabledType'],
                      )
                    }
                  >
                    <img
                      src={
                        element.value === updateSourceEnabledType
                          ? ActiveRadioIcon
                          : IconInactiveRadio
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
    </ModalLayout>
  );
};

const InputWrapper = ({
  label,
  inputName,
  suggestion,
  value,
  onChangeInput,
}: {
  label: string;
  inputName?: string;
  suggestion: string;
  value?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex items-center">
      <p className="w-[120px] text-sm mr-3 font-medium">{label}</p>
      <Input
        className="w-[125px] h-9"
        type="text"
        inputMode="decimal"
        name={inputName}
        value={value}
        onChange={onChangeInput}
      />
      <p className="ml-2 text-sm text-[#4C5968]">{suggestion}</p>
    </div>
  );
};
export default ChatBotUpdateConfigWrap;
