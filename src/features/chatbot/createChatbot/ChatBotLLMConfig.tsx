import React, { useState } from 'react';

import { DefaultTable } from '@/components/DefaultTable';
import RegisterCardLayout from '@/components/RegisterCardLayout';
import useCreateChatbotStore from '@/shared/hooks/useCreateChatbotStore';
import EyeOffIcon from '@/shared/icons/icon-eyeOff.svg';
import EyeOnIcon from '@/shared/icons/icon-eyeOn.svg';
import { Button } from '@/shared/ui/button';

import { InputWrapper } from './RetrieverConfig';

const ChatBotLLMConfig = () => {
  // zustand
  const { llmOptions, setLLMOptions } = useCreateChatbotStore();

  // state
  const [showLLMSuggest, setShowLLMSuggest] = useState(false);

  const changeLLMInput = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setLLMOptions({
          ...llmOptions,
          ['llmTemperature']: formattedValue,
        });
        break;
      case 'llmTopProbability':
        setLLMOptions({
          ...llmOptions,
          ['llmTopProbability']: formattedValue,
        });
        break;
      case 'llmMaxTokens':
        setLLMOptions({
          ...llmOptions,
          ['llmMaxTokens']: formattedValue,
        });
        break;
      default:
        break;
    }
  };

  return (
    <RegisterCardLayout
      title="LLM 옵션 설정"
      optionButton={
        <Button
          className="flex h-7 items-center gap-1 px-3"
          onClick={() => setShowLLMSuggest((prev) => !prev)}
        >
          권장옵션
          <img src={showLLMSuggest ? EyeOnIcon : EyeOffIcon} alt="eyeOn" />
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {showLLMSuggest && (
          <>
            <p className="text-lg font-bold">추천 설정 적용하기</p>
            <div className="w-full p-3 bg-[#F8F9FB] rounded-sm flex items-center gap-2">
              <div className="border border-[#D0D5DD] bg-white text-sm text-primary px-3 h-7 rounded-sm flex items-center">
                권장옵션
              </div>
              <div className="flex-1">
                <DefaultTable
                  bodyStyle="bg-white"
                  headerList={[
                    { key: 'purpose', label: '목적' },
                    { key: 'temperature', label: '온도' },
                    { key: 'top_p', label: 'top_p' },
                    { key: 'max_tokens', label: 'max_tokens' },
                    { key: 'result_style', label: '결과 스타일' },
                    {
                      key: 'apply',
                      label: '적용',
                      render: (_, dataItem) => {
                        return (
                          <Button
                            className="flex h-5 items-center px-2 border-[#0066C3] text-[#0066C3]"
                            onClick={() =>
                              setLLMOptions({
                                llmTemperature: dataItem.temperature,
                                llmTopProbability: dataItem.top_p,
                                llmMaxTokens: dataItem.max_tokens,
                              })
                            }
                          >
                            적용
                          </Button>
                        );
                      },
                    },
                  ]}
                  data={[
                    {
                      purpose: '정책문서 기반 정답 챗봇',
                      temperature: '0.2',
                      top_p: '0.8',
                      max_tokens: '512',
                      result_style: '정답 제공, 유연성 낮음',
                      apply: '적용',
                    },
                    {
                      purpose: '고객상담 챗봇',
                      temperature: '0.5',
                      top_p: '0.9',
                      max_tokens: '512',
                      result_style: '실용적인 톤과 다양성',
                      apply: '적용',
                    },
                    {
                      purpose: '아이디어 브레인스토밍',
                      temperature: '0.9',
                      top_p: '1.0',
                      max_tokens: '1,000',
                      result_style: '창의적 발상, 다양한 표현',
                      apply: '적용',
                    },
                  ]}
                />
              </div>
            </div>
          </>
        )}

        <p className="text-lg font-bold">온도(Temperature)</p>
        {showLLMSuggest && (
          <div className="w-full p-3 bg-[#F8F9FB] rounded-sm flex items-center gap-2">
            <div className="border border-[#D0D5DD] bg-white text-sm text-primary px-3 h-7 rounded-sm flex items-center">
              권장옵션
            </div>
            <div className="flex-1">
              <DefaultTable
                headerStyle="bg-[#667183] [&_th]:text-white"
                bodyStyle="bg-white"
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
            </div>
          </div>
        )}
        <InputWrapper
          label="온도(Temperature)"
          inputName="llmTemperature"
          suggestion="최소값 0.0~최대값 1.0"
          description="생성되는 문장의 무작위성(랜덤성)을 조절하는 값. 낮을수록 정확하고 예측 가능한 응답, 높을수록 창의적이고 다양한 응답 제공"
          value={llmOptions.llmTemperature}
          onChangeInput={changeLLMInput}
        />
        <p className="text-lg font-bold">Top-p 샘플링</p>
        {showLLMSuggest && (
          <div className="w-full p-3 bg-[#F8F9FB] rounded-sm flex items-center gap-2">
            <div className="border border-[#D0D5DD] bg-white text-sm text-primary px-3 h-7 rounded-sm flex items-center">
              권장옵션
            </div>
            <div className="flex-1">
              <DefaultTable
                headerStyle="bg-[#667183] [&_th]:text-white"
                bodyStyle="bg-white"
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
            </div>
          </div>
        )}
        <InputWrapper
          label="Top-p(핵 샘플링)"
          inputName="llmTopProbability"
          suggestion="최소값 0.0~최대값 1.0"
          description="응답 생성 시, 확률이 높은 단어들 중에서 “상위 확률 p%의 단어 집합”에서만 샘플링하며, temperature와 함께 쓰여 무작위성 조절"
          value={llmOptions.llmTopProbability}
          onChangeInput={changeLLMInput}
        />
        <p className="text-lg font-bold">Max_tokens(최대 응답 길이)</p>
        {showLLMSuggest && (
          <div className="w-full p-3 bg-[#F8F9FB] rounded-sm flex items-center gap-2">
            <div className="border border-[#D0D5DD] bg-white text-sm text-primary px-3 h-7 rounded-sm flex items-center">
              권장옵션
            </div>
            <div className="flex-1">
              <DefaultTable
                headerStyle="bg-[#667183] [&_th]:text-white"
                bodyStyle="bg-white"
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
            </div>
          </div>
        )}
        <InputWrapper
          label="최대 응답 길이"
          inputName="llmMaxTokens"
          suggestion="최소값 50자~최대값 2,000자"
          description="한 번의 응답에서 생성될 최대 토큰 수 제한입니다. 토큰은 단어 조각(부분 단어) 단위. 1,000자 = 약 700~800 토큰 정도"
          value={llmOptions.llmMaxTokens}
          onChangeInput={changeLLMInput}
        />
      </div>
    </RegisterCardLayout>
  );
};

export default ChatBotLLMConfig;
