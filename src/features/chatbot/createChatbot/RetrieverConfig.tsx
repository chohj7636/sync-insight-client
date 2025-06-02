import { useEffect, useState } from 'react';

import { DefaultTable } from '@/components/DefaultTable';
import RegisterCardLayout from '@/components/RegisterCardLayout';
import { CreateChatBotParams } from '@/lib/api/chatbot/type';
import useCreateChatbotStore, {
  KEYWORD_MATCH_TYPE_LIST,
  RETRIEVER_TYPE_LIST,
} from '@/shared/hooks/useCreateChatbotStore';
import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import EyeOffIcon from '@/shared/icons/icon-eyeOff.svg';
import EyeOnIcon from '@/shared/icons/icon-eyeOn.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

const RetrieverConfig = () => {
  // zustand
  const {
    retrieverType,
    setRetrieverType,
    keywordMatchType,
    setKeywordMatchType,
    retrieverCount,
    setRetrieverCount,
    reRankedCount,
    setReRankedCount,
    vectorThreshold,
    setVectorThreshold,
    vectorWeight,
    setVectorWeight,
  } = useCreateChatbotStore();

  // state
  const [showRetrieverSuggest, setShowRetrieverSuggest] = useState(false);

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
        setRetrieverCount(formattedValue);
        break;
      case 'reRankedCount':
        setReRankedCount(formattedValue);
        break;
      case 'vectorThreshold':
        setVectorThreshold(formattedValue);
        break;
      case 'vectorWeight':
        setVectorWeight(formattedValue);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (retrieverType !== 'HYBRID') {
      setVectorWeight('0');
    }
  }, [retrieverType, setVectorWeight]);

  return (
    <RegisterCardLayout
      title="검색기(리트리버) 설정"
      optionButton={
        <Button
          className="flex h-7 items-center gap-1 px-3"
          onClick={() => setShowRetrieverSuggest((prev) => !prev)}
        >
          권장옵션
          <img
            src={showRetrieverSuggest ? EyeOnIcon : EyeOffIcon}
            alt="eyeOn"
          />
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">리트리버 유형</p>
        <div className="flex items-center gap-5">
          <p className="w-[116px] text-[15px] font-medium">유사도 측정 방식</p>
          <div
            id="button-wrap"
            className="flex h-7 rounded-sm border border-[#E4E7EB]"
          >
            {RETRIEVER_TYPE_LIST.map((element) => {
              return (
                <Button
                  key={element.value}
                  className={`h-full w-[134px] rounded-sm border-2 text-sm ${
                    retrieverType === element.value
                      ? 'border-[#0066C3] bg-[#F1F7FD] text-[#0066C3]'
                      : 'border-white bg-white'
                  }`}
                  onClick={() =>
                    setRetrieverType(
                      element.value as CreateChatBotParams['retrieverType'],
                    )
                  }
                >
                  {element.label}
                </Button>
              );
            })}
          </div>
        </div>

        {showRetrieverSuggest && (
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
        )}

        <div className="h-[1px] w-full bg-[#D0D5DD]" />

        <p className="text-lg font-bold">리트리버 기본 설정 값</p>

        {showRetrieverSuggest && (
          <div className="w-full p-3 bg-[#F8F9FB] rounded-sm flex items-center gap-2">
            <div className="border border-[#D0D5DD] bg-white text-sm text-primary px-3 h-7 rounded-sm flex items-center">
              권장옵션
            </div>
            {retrieverType === 'SEMANTIC' ? (
              <div className="flex flex-col gap-1 text-sm text-[#98A2B2]">
                <p>✅ 검색 결과 수(Top-K): 5~10</p>
                <p>✅ 최소 유사도 임계값: 0.75</p>
              </div>
            ) : retrieverType === 'KEYWORD' ? (
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
        )}

        <InputWrapper
          label="검색 결과 수(Top-K)"
          inputName="retrieverCount"
          suggestion="최소값 1~최대값 50"
          description="검색 결과 중 상위 K개를 반환합니다. 값이 클수록 속도가 저하될 가능성이 있습니다."
          value={retrieverCount}
          onChangeInput={changeRetrieverInput}
        />

        <InputWrapper
          label="재정렬 결과 수"
          inputName="reRankedCount"
          suggestion="최소값 1~최대값 Top-K 수"
          description="Top-K를 의미 유사도 기반으로 재정렬하여 최종 응답에 사용하는 문서 수를 설정합니다."
          value={reRankedCount}
          onChangeInput={changeRetrieverInput}
        />

        <InputWrapper
          label="최소 유사도 임계값"
          inputName="vectorThreshold"
          suggestion="최소값 0.0~최대값 1.0"
          description="코사인 유사도 기준 1.0에 가까울수록 더 정밀한 검색이 가능합니다."
          value={vectorThreshold}
          onChangeInput={changeRetrieverInput}
        />

        {retrieverType === 'HYBRID' && (
          <>
            <div className="h-[1px] w-full bg-[#D0D5DD]" />
            <p className="text-lg font-bold">벡터/키워드 가중치</p>
            <InputWrapper
              label="벡터 가중치"
              inputName="vectorWeight"
              suggestion="최소값 0.0~최대값 1.0"
              description="문장의 의미적 유사도(score) 반영 가중치를 설정합니다. 벡터가중치와 키워드 가중치의 합은 1입니다."
              value={vectorWeight}
              onChangeInput={changeRetrieverInput}
            />

            <InputWrapper
              label="키워드 가중치"
              suggestion="최소값 0.0~최대값 1.0"
              isDisabled
              value={(1 - Number(vectorWeight)).toString()}
              description="질문과 문서 간 단어 일치 정도(score) 반영 가중치를 설정합니다."
            />
          </>
        )}

        {retrieverType !== 'SEMANTIC' && (
          <>
            <div className="h-[1px] w-full bg-[#D0D5DD]" />
            <p className="text-lg font-bold">키워드 일치 방식</p>
            <div className="flex items-center gap-5">
              <p className="min-w-[130px] text-[15px] font-medium">
                키워드 일치 방식
              </p>
              <div className="flex items-center gap-5">
                {KEYWORD_MATCH_TYPE_LIST.map((element) => {
                  return (
                    <div
                      key={element.value}
                      className="flex gap-1 items-center cursor-pointer"
                      onClick={() =>
                        setKeywordMatchType(
                          element.value as CreateChatBotParams['keywordMatchType'],
                        )
                      }
                    >
                      <img
                        src={
                          keywordMatchType === element.value
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
          </>
        )}
      </div>
    </RegisterCardLayout>
  );
};

export default RetrieverConfig;

export const InputWrapper = ({
  label,
  inputName,
  suggestion,
  description,
  value,
  isDisabled,
  onChangeInput,
}: {
  label: string;
  inputName?: string;
  suggestion: string;
  description: string;
  value?: string;
  isDisabled?: boolean;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex gap-5">
      <p className="h-9 flex items-center min-w-[130px] text-[15px] font-medium">
        {label}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            className="w-[125px] h-9"
            type="text"
            inputMode="decimal"
            name={inputName}
            value={value ?? ''}
            onChange={onChangeInput}
            disabled={isDisabled}
          />
          <p className="text-sm text-[#667183]">{suggestion}</p>
        </div>
        <p className="text-sm text-[#4C5667]">{description}</p>
      </div>
    </div>
  );
};
