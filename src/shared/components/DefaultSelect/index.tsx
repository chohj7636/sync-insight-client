import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface DefaultSelectProps {
  className?: string;
  defaultValue?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectList: {
    label: string;
    value: string;
  }[];
}

const DefaultSelect = ({
  className,
  defaultValue,
  setValue,
  selectList,
}: DefaultSelectProps) => {
  return (
    <Select
      onValueChange={(value) => setValue(value)}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={`${className} cursor-pointer`}>
        <SelectValue placeholder="상태 선택" defaultValue={defaultValue} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectList.map((element) => {
            return (
              <SelectItem key={element.value} value={element.value}>
                {element.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DefaultSelect;
