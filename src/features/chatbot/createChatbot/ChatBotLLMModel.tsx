import { useEffect } from 'react';

import { getLLMModelListApi } from '@/lib/api/chatbot/api';
import RegisterCardLayout from '@/shared/components/RegisterCardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import useCreateChatbotStore from '@/shared/hooks/useCreateChatbotStore';
import ActiveRadioIcon from '@/shared/icons/icon-activeRadio.svg';
import InactiveRadioIcon from '@/shared/icons/icon-inactiveRadio.svg';
import { useQuery } from '@tanstack/react-query';

const ChatBotLLMModel = () => {
  // zustand
  const { llm, setLLM } = useCreateChatbotStore();

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

  // by 값으로 데이터 그룹화
  const groupedModels =
    llmModelList?.reduce(
      (acc, item) => {
        const by = item.by;
        if (!acc[by]) {
          acc[by] = [];
        }
        acc[by].push(item);
        return acc;
      },
      {} as Record<string, typeof llmModelList>,
    ) || {};

  useEffect(() => {
    if (llmModelList) {
      setLLM({
        model: llmModelList[0].model,
        displayName: llmModelList[0].displayName,
      });
    }
  }, [llmModelList, setLLM]);

  return (
    <RegisterCardLayout title="LLM 모델 설정">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">기반 모델</p>
        <div className="flex items-center gap-5">
          <p className="text-[15px] w-[116px] font-medium">선택된 모델</p>
          <div className="w-[380px] h-9 rounded-sm border border-[#D0D5DD] bg-white text-[15px] flex items-center px-3">
            {llm.displayName}
          </div>
        </div>

        <Table>
          <TableHeader className="border-t border-t-black bg-[#F8F9FB]">
            <TableRow className="[&_th]:text-center">
              <TableHead>모델</TableHead>
              <TableHead colSpan={2}>상세모델</TableHead>
              <TableHead>설명</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedModels).map(([by, items]) =>
              items.map((model, index) => (
                <TableRow
                  key={`${by}-${index}`}
                  className="hover:bg-transparent [&_td]:py-1 [&_td]:text-center"
                  onClick={() => {
                    setLLM({
                      model: model.model,
                      displayName: model.displayName,
                    });
                  }}
                >
                  {index === 0 ? (
                    <TableCell rowSpan={items.length}>{by}</TableCell>
                  ) : null}
                  <TableCell className="w-20 border-x border-x-[#E4E7EB]">
                    <div className="w-full flex items-center justify-center cursor-pointer">
                      <img
                        src={
                          model.model === llm.model
                            ? ActiveRadioIcon
                            : InactiveRadioIcon
                        }
                        alt="RadioIcon"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="border-x border-x-[#E4E7EB]">
                    {model.displayName}
                  </TableCell>
                  <TableCell>{model.description}</TableCell>
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
      </div>
    </RegisterCardLayout>
  );
};

export default ChatBotLLMModel;
