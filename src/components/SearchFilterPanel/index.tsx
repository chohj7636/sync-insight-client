import { DateRange } from 'react-day-picker';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import DefaultSelect from '../DefaultSelect';

interface SearchFilterPanelProps {
  selectList?: {
    label: string;
    value: string;
  }[];
  setOrganName: React.Dispatch<React.SetStateAction<string | undefined>>;
  secondInputLabel: string;
  setSecondInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  setStatus?: (value: string | undefined) => void;
  setCreatorName?: React.Dispatch<React.SetStateAction<string | undefined>>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  clickSearch: () => void;
}

const SearchFilterPanel = ({
  selectList,
  setOrganName,
  secondInputLabel,
  setSecondInputValue,
  setStatus,
  setCreatorName,
  date,
  setDate,
  clickSearch,
}: SearchFilterPanelProps) => {
  return (
    <div className="flex w-full flex-col gap-4 border-t border-t-black bg-[#F8F9FB] px-5 py-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          <p className="text-sm">회원사명</p>
          <Input
            className="h-[36px] w-[388px] rounded-sm bg-white"
            onChange={(e) => setOrganName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6">
          <p className="text-sm">{secondInputLabel}</p>
          <Input
            className="h-[36px] w-[388px] rounded-sm bg-white"
            onChange={(e) => setSecondInputValue(e.target.value)}
          />
        </div>
        {selectList && setStatus ? (
          <div className="flex items-center gap-6">
            <p className="text-sm">상태</p>
            <DefaultSelect
              className="h-[36px] w-[150px] rounded-sm bg-white"
              selectList={selectList}
              setValue={(value) => setStatus(value as string)}
            />
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <p className="text-sm">생성자명</p>
            <Input
              className="h-[36px] w-[200px] rounded-sm bg-white"
              onChange={(e) => {
                if (setCreatorName) {
                  setCreatorName(e.target.value);
                }
              }}
            />
          </div>
        )}
      </div>
      {/* calendar */}
      <div className="flex items-center gap-6">
        <p className="text-sm">등록일</p>
        <DatePickerWithRange dateValue={date} setDateValue={setDate} />
      </div>

      <div className="flex w-full justify-end">
        <Button
          className="h-[52px] w-[100px] rounded-sm bg-[#667183] text-sm text-white"
          onClick={clickSearch}
        >
          조회하기
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterPanel;

/**
 * 초기 날짜 state는 undefined
 * 캘린더를 오픈했을때 Calendar Component의 defaultMonth prop을 현재 날짜로 설정
 */
interface DatePickerWithRangeProps {
  dateValue: DateRange | undefined;
  setDateValue: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  className?: string;
}

function DatePickerWithRange({
  dateValue,
  setDateValue,
  className,
}: DatePickerWithRangeProps) {
  //   const [date, setDate] = useState<DateRange | undefined>({
  //     from: new Date(2022, 0, 20),
  //     to: addDays(new Date(2022, 0, 20), 20),
  //   });

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-[260px] items-center justify-start rounded-sm border px-4 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none',
              !dateValue && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue?.from ? (
              dateValue.to ? (
                <>
                  {format(dateValue.from, 'yyyy-MM-dd')} -{' '}
                  {format(dateValue.to, 'yyyy-MM-dd')}
                </>
              ) : (
                format(dateValue.from, 'yyyy-MM-dd')
              )
            ) : (
              <span>날짜를 선택하세요</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            selected={dateValue}
            onSelect={setDateValue}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
