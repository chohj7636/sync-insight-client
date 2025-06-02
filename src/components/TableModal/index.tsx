import { useState } from 'react';

import ActiveRadioIcon from '@/assets/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/assets/icons/icon-inactiveRadio.svg';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrganizationsList } from '@/lib/api/organizations/api';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import DefaultSelect from '../DefaultSelect';
import { DefaultPagination } from '../Pagination';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TableModalProps {
  type: 'organization' | 'directory';
  title: string;
  clickConfirm?: (organId: string, organName: string) => void;
  closeModal: () => void;
}

const HEADERLIST = [
  {
    label: '선택',
    key: 'id',
  },
  { label: '회원사명', key: 'organName' },
  { label: '사업자등록번호', key: 'bizRegNo' },
  {
    label: '상태',
    key: 'status',
    render: (value: string) => {
      return value === 'ACTIVE' ? '이용중' : '이용중지';
    },
  },
  {
    label: '등록일',
    key: 'createAt',
    render: (value: string) => format(new Date(value), 'yyyy-MM-dd'),
  },
];

const SELECTLIST = [
  {
    label: '회원사명',
    value: 'organName',
  },
  {
    label: '사업자등록번호',
    value: 'bizRegNo',
  },
];

const TableModal = ({
  title,
  type,
  clickConfirm,
  closeModal,
}: TableModalProps) => {
  // state
  const [selectValue, setSelectValue] = useState<string>(SELECTLIST[0].value);
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selectDataInfo, setSelectDataInfo] = useState<Record<string, any>>({});

  // 회원사 찾기 화면 query
  const { data, refetch } = useQuery({
    queryKey: ['organizations-modal'],
    queryFn: () => {
      const params = {
        size: 10,
        ...(selectValue === 'organName' && { organName: searchValue }),
        ...(selectValue === 'bizRegNo' && { bizRegNo: searchValue }),
      };

      return getOrganizationsList(params);
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const checkValue = (value: string) => {
    setSelectValue(value);
    setSearchValue('');
  };

  const clickTableRow = (dataItem: Record<string, any>) => {
    setSelectDataInfo(dataItem);
  };

  const clickConfirmButton = () => {
    switch (type) {
      case 'organization':
        clickConfirm?.(selectDataInfo.id, selectDataInfo.organName);

        break;

      default:
        break;
    }
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
      <div className="w-[580px] rounded-md bg-white p-8">
        {/* header */}
        <p className="text-2xl font-bold text-[#27303F]">{title}</p>

        {/* body */}
        <div className="mt-6 mb-12 flex w-full flex-col gap-3">
          <div id="filter" className="flex gap-2">
            <DefaultSelect
              className="h-[36px] min-w-[160px]"
              defaultValue={SELECTLIST[0].value}
              selectList={SELECTLIST}
              // setValue={setSelectValue}
              setValue={(value) => checkValue(value as string)}
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              className="h-[36px] w-[80px] rounded-sm bg-[#667183] text-white"
              onClick={() => refetch()}
            >
              검색
            </Button>
          </div>

          {/* table */}
          {data && (
            <>
              <ModalTable
                data={data.payload.content || []}
                headerList={HEADERLIST}
                onclickTableRow={clickTableRow}
              />
              <DefaultPagination
                totalPages={data?.payload.totalPages ?? 0}
                currentPage={page + 1}
                setCurrentPage={(prevPage) => {
                  setPage(prevPage - 1);
                }}
              />
            </>
          )}
        </div>

        {/* button wrap */}
        <div className="grid w-full grid-cols-2 gap-2">
          <Button className="h-[52px]" onClick={closeModal}>
            취소
          </Button>
          <Button
            className="h-[52px]"
            variant="blue"
            disabled={!selectDataInfo.id}
            onClick={clickConfirmButton}
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;

type HeaderItem = {
  label: string;
  key: string;
  style?: string;
  render?: (
    value: string,
    // data type과 맞추기 위해 모든 타입을 any로 설정
    dataItem: Record<string, any>, // === { [key: string]: any }
  ) => JSX.Element | string;
};

type ModalTableProps = {
  data: Array<Record<string, any>>; // 테이블 바디에 들어가는 텍스트 데이터이기 때문에 모든 타입을 any로 설정
  headerList: Array<HeaderItem>;
  onclickTableRow?: (dataItem: Record<string, any>) => void;
};

export const ModalTable: React.FC<ModalTableProps> = ({
  data,
  headerList,
  onclickTableRow,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowClick = (dataItem: Record<string, any>) => {
    const id = dataItem.id || dataItem.dirId;
    setSelectedRowId(id);
    onclickTableRow?.(dataItem);
  };

  return (
    <Table>
      <TableHeader className="border-t border-t-black bg-[#F8F9FB]">
        <TableRow>
          {headerList.map((element) => {
            return (
              <TableHead
                key={element.key}
                className={`${element.style} h-[28px] text-center`}
              >
                {element.label}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((dataItem, index) => {
          const rowId = dataItem.id || dataItem.dirId;
          return (
            <TableRow
              key={index}
              className={`h-[35px] cursor-pointer text-[13px] hover:bg-[#F1F7FD] ${rowId === selectedRowId ? 'bg-[#F1F7FD]' : ''}`}
              onClick={() => handleRowClick(dataItem)}
            >
              {headerList.map((header) => (
                <TableCell key={header.key} className="text-center">
                  {header.key === 'id' ? (
                    <div className="flex items-center justify-center">
                      <img
                        src={
                          rowId === selectedRowId
                            ? ActiveRadioIcon
                            : InactiveRadioIcon
                        }
                        alt="RadioIcon"
                      />
                    </div>
                  ) : header.render ? (
                    header.render(dataItem[header.key], dataItem)
                  ) : (
                    dataItem[header.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
