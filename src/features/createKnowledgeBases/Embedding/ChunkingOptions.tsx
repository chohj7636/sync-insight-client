import DefaultSelect from '@/components/DefaultSelect';
import { DefaultTable } from '@/components/DefaultTable';
import RegisterCardLayout from '@/components/RegisterCardLayout';
import useCreateKnowledgeBaseStore from '@/shared/hooks/useCreateKnowledgeBaseStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface ChunkingOptionsProps {
  chunkingType: 'RECURSIVE' | 'TEXT' | 'SEMANTIC';
}

const ChunkingOptions = ({ chunkingType }: ChunkingOptionsProps) => {
  // zustand state
  const {
    splitter,
    recursiveLevel,
    setRecursiveLevel,
    textStandard,
    setTextStandard,
    breakPointType,
    setBreakPointType,
    breakPointAmount,
    setBreakPointAmount,
    chunkSize,
    setChunkSize,
    chunkOverlap,
    setChunkOverlap,
  } = useCreateKnowledgeBaseStore();

  const printBreakPointAmoutTitle = () => {
    switch (breakPointType) {
      case 'PERCENTILE':
      case 'GRADIENT':
        return '임계값 범위';
      case 'STANDARD_DEVIATION':
        return '표준편차';
      case 'INTERQUARTILE':
        return '시분위수 범위';
      default:
        return '';
    }
  };

  const printBreakPointAmountDescription = () => {
    switch (breakPointType) {
      case 'PERCENTILE':
      case 'GRADIENT':
        return '0~100 사이의 정수';
      case 'STANDARD_DEVIATION':
        return '0이상의 실수 / 일반적으로 1.0~5.0 사용';
      case 'INTERQUARTILE':
        return '0이상의 실수 / 보통 1.5를 기준값으로 사용';
      default:
        return '';
    }
  };

  return (
    <RegisterCardLayout title="청킹 옵션">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center gap-2 rounded-sm bg-[#F8F9FB] p-3">
          <div className="flex h-7 w-[70px] items-center justify-center rounded-sm border border-[#D0D5DD] bg-white text-center text-sm">
            권장옵션
          </div>
          <div className="flex flex-col gap-1 text-sm text-[#98A2B2]">
            <p>✅ 일반 텍스트: Chunk 크기 512 토큰 + Overlap(중첩) 100 토큰</p>
            <p>✅ 긴 텍스트: Chunk 크기 1024 토큰 + Overlap 200 토큰</p>
          </div>
        </div>

        {chunkingType === 'SEMANTIC' ? (
          <div className="flex w-full flex-col gap-4">
            <p className="text-lg font-bold">백분위 설정</p>
            <div className="flex gap-5">
              <p className="flex h-[36px] w-[116px] items-center">
                분할 기준 타입
              </p>
              <DefaultSelect
                className="h-[36px] w-[200px] text-[14px]"
                selectList={[
                  { label: '비율기반', value: 'PERCENTILE' },
                  { label: '정규분포 가정', value: 'STANDARD_DEVIATION' },
                  { label: '사분위수 기반', value: 'INTERQUARTILE' },
                  { label: '변화율 기반', value: 'GRADIENT' },
                ]}
                setValue={(val) =>
                  setBreakPointType(
                    val as
                      | 'PERCENTILE'
                      | 'STANDARD_DEVIATION'
                      | 'INTERQUARTILE'
                      | 'GRADIENT',
                  )
                }
                defaultValue={breakPointType}
              />
            </div>
            <div className="flex gap-5">
              <p className="flex h-[36px] w-[116px] items-center">
                {printBreakPointAmoutTitle()}
              </p>
              <div className="flex flex-col gap-4">
                <Input
                  className="h-[36px] w-[200px] placeholder:text-[14px]"
                  placeholder="숫자만 입력할 수 있습니다."
                  value={breakPointAmount}
                  onChange={(e) =>
                    setBreakPointAmount(Number(e.target.value) || 0)
                  }
                />
                <p className="text-sm text-[#4C5667]">
                  {printBreakPointAmountDescription()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">토큰 수 설정</p>
              <div className="flex gap-5">
                <p className="flex h-[36px] w-[116px] items-center">토큰 수</p>
                <div className="flex flex-col gap-4">
                  <Input
                    className="h-[36px] w-[200px] placeholder:text-[14px]"
                    placeholder="숫자만 입력할 수 있습니다."
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value) || 0)}
                  />
                  <p className="text-sm text-[#4C5667]">
                    {chunkingType === 'RECURSIVE'
                      ? '512~1,024 토큰이 권장됩니다.(예: 논문은 1000 토큰, 법률 문서는 2000 토큰)'
                      : '1,000~2,000토큰이 권장됩니다.'}
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#F6F7FA]" />

              <p className="text-lg font-bold">중첩도(Overlap) 설정</p>
              <div className="flex gap-5">
                <p className="flex h-[36px] w-[116px] items-center">
                  중첩 토큰 수
                </p>
                <div className="flex flex-col gap-4">
                  <Input
                    className="h-[36px] w-[200px] placeholder:text-[14px]"
                    placeholder="숫자만 입력할 수 있습니다."
                    value={chunkOverlap}
                    onChange={(e) =>
                      setChunkOverlap(Number(e.target.value) || 0)
                    }
                  />
                  <p className="text-sm text-[#4C5667]">
                    {`중복되는 부분의 비율을 설정하여 문맥의 연속성을 유지합니다.
                    일반적으로 ${
                      chunkingType === 'RECURSIVE' ? '64~128' : '100~300'
                    } 토큰이 권장됩니다.`}
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#F6F7FA]" />

              <p className="text-lg font-bold">
                {chunkingType === 'RECURSIVE'
                  ? '재귀 분할 허용 깊이 설정'
                  : '분할 기준 선택'}
              </p>
              <div className="flex w-full gap-5">
                <p className="flex h-[36px] w-[116px] items-center">
                  {chunkingType === 'RECURSIVE' ? 'Max_depth' : 'Text_Standard'}
                </p>
                <div className="flex flex-1 flex-col gap-4">
                  <div
                    id="button-wrap"
                    className="flex h-7 w-fit rounded-sm border border-[#E4E7EB]"
                  >
                    {[1, 2, 3, 4].map((element) => {
                      return (
                        <Button
                          key={element}
                          className={`h-full w-[30px] rounded-sm border-2 text-sm ${
                            splitter === 'RECURSIVE'
                              ? recursiveLevel === element
                                ? 'border-[#0066C3] bg-[#F1F7FD] text-[#0066C3]'
                                : 'border-white bg-white'
                              : textStandard === element
                                ? 'border-[#0066C3] bg-[#F1F7FD] text-[#0066C3]'
                                : 'border-white bg-white'
                          }`}
                          onClick={() =>
                            splitter === 'RECURSIVE'
                              ? setRecursiveLevel(element)
                              : setTextStandard(element)
                          }
                        >
                          {element}
                        </Button>
                      );
                    })}
                  </div>

                  <DefaultTable
                    headerStyle="h-[53px]"
                    headerList={[
                      {
                        label:
                          chunkingType === 'RECURSIVE'
                            ? 'Max_depth 값'
                            : 'Text_Standard 값',
                        key: 'id',
                      },
                      { label: '설명', key: 'description' },
                      { label: '권장 데이터 형식', key: 'format' },
                    ]}
                    bodyStyle="h-[45px]"
                    data={[
                      {
                        id: 1,
                        description: `문단 단위${
                          chunkingType === 'RECURSIVE' ? '까지만' : '로'
                        } 나눔(\\n\\n)`,
                        format: '정형화된 보고서 / 매뉴얼',
                      },
                      {
                        id: 2,
                        description: `줄바꿈 단위${
                          chunkingType === 'RECURSIVE' ? '까지' : '로'
                        } 나눔(\\n)`,
                        format: '간단한 블로그나 설명문',
                      },
                      {
                        id: 3,
                        description: `문장 단위${
                          chunkingType === 'RECURSIVE' ? '까지' : '로'
                        } 나눔(. )`,
                        format: '정책 보고서, 논문 등 구조화 문서',
                      },
                      {
                        id: 4,
                        description: `공백 단위${
                          chunkingType === 'RECURSIVE' ? '까지' : '로'
                        } 나눔( )`,
                        format: '대화형 데이터나 챗 로그',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RegisterCardLayout>
  );
};

export default ChunkingOptions;
