interface ConfigCardProps {
  data: {
    title: string;
    value: string | number;
  }[];
}

const ConfigCard = ({ data }: ConfigCardProps) => {
  const printChunkingOptTitle = (title: string) => {
    switch (title) {
      case 'PERCENTILE':
        return '임계값 범위';
      case 'STANDARD_DEVIATION':
        return '표준편차';
      case 'INTERQUARTILE':
        return '사분위수 범위';
      case 'GRADIENT':
        return '변화율 기반';

      default:
        return title;
    }
  };

  const printChunkingOptValue = (value: string | number) => {
    switch (value) {
      case 'RECURSIVE':
        return '재귀적 분할 방식';
      case 'TEXT':
        return '텍스트 분할 방식';
      case 'SEMANTIC':
        return '의미론적 분할 방식';

      case 'PERCENTILE':
        return '비율기반';
      case 'STANDARD_DEVIATION':
        return '정규분포 가정';
      case 'INTERQUARTILE':
        return '분위수 기반';
      case 'GRADIENT':
        return '변화율 기반';

      case 'FULL':
        return '전체 인덱싱';
      case 'INCREMENTAL':
        return '증분 인덱싱';

      case 'ONE_TIME':
        return '일회성';
      case 'DAILY':
        return '일별';
      case 'WEEKLY':
        return '주별';
      case 'MONTHLY':
        return '월별';
      case 'YEARLY':
        return '연간';

      default:
        return value;
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-sm bg-[#F8F9FB] p-4 text-[15px]">
      {data.map((element) => {
        return (
          <div key={element.title} className="flex flex-col gap-1">
            <p className="font-medium">
              {printChunkingOptTitle(element.title)}
            </p>
            <p className="font-bold">{printChunkingOptValue(element.value)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ConfigCard;
