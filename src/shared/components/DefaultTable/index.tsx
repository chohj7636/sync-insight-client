import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

type HeaderItem = {
  label: string;
  key: string;
  style?: string;
  render?: (
    value: string,
    // data type과 맞추기 위해 모든 타입을 any로 설정
    dataItem: Record<string, any>, // === { [key: string]: any }
  ) => JSX.Element | string;
  children?: Omit<HeaderItem, 'label' | 'children'>[];
};

export type DefaultTableProps = {
  data: Array<Record<string, any>>; // 테이블 바디에 들어가는 텍스트 데이터이기 때문에 모든 타입을 any로 설정
  headerList: Array<HeaderItem>;
  headerStyle?: string;
  bodyStyle?: string;
  isScroll?: boolean; // 테이블 세로 스크롤 여부, 스크롤 시 테이블 헤더가 고정됨
  onclickTableRow?: (dataItem: Record<string, any>, index: number) => void;
  selectedRow?: number;
  onClickAllCheckbox?: () => void;
};

export const DefaultTable: React.FC<DefaultTableProps> = ({
  data,
  headerList,
  headerStyle,
  bodyStyle,
  isScroll,
  onclickTableRow,
  selectedRow,
  onClickAllCheckbox,
}) => {
  return (
    <Table>
      <TableHeader
        className={`${isScroll ? 'sticky top-0' : ''} border-t border-t-black bg-[#F8F9FB] ${headerStyle}`}
      >
        <TableRow>
          {headerList.map((element, index) => (
            <TableHead
              key={element.key + index}
              className={`${element.style} text-center`}
              colSpan={element.children?.length || 1} // 중첩된 헤더가 있는 경우 열 병합
            >
              {element.key === 'select' ? (
                <Checkbox onCheckedChange={onClickAllCheckbox} />
              ) : (
                element.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length > 0 ? (
          data.map((dataItem, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={`${bodyStyle} ${selectedRow === rowIndex ? 'bg-[#F1F7FD] hover:bg-[#F1F7FD]' : ''} ${onclickTableRow ? 'cursor-pointer' : ''}`}
              onClick={() => onclickTableRow?.(dataItem, rowIndex)}
            >
              {headerList.map((header, colIndex) => {
                // 중첩된 헤더가 있는 경우 열 병합
                if (header.children) {
                  return header.children.map((child, childIndex) => (
                    <TableCell
                      key={`${header.key}-${childIndex}`}
                      className={`text-center ${child.style}`}
                    >
                      {child.render
                        ? child.render(dataItem[child.key], dataItem)
                        : dataItem[child.key]}
                    </TableCell>
                  ));
                }

                return (
                  <TableCell
                    key={header.key + colIndex}
                    className={`text-center ${header.style}`}
                  >
                    {header.key === 'index'
                      ? rowIndex + 1
                      : header.render
                        ? header.render(dataItem[header.key], dataItem)
                        : dataItem[header.key]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={headerList.length} className="text-center">
              데이터가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
