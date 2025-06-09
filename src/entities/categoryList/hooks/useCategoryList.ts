import { useQuery } from '@tanstack/react-query';

import { getCategoryListApi } from '../api/api';

interface useCategoryListProps {
  organId: string;
}

export const useCategoryList = ({ organId }: useCategoryListProps) => {
  // 카테고리 조회 query
  const { data: categoryListResponseData, refetch: refetchCategoryList } =
    useQuery({
      queryKey: ['categoryListResponseData', organId],
      queryFn: () => getCategoryListApi({ organId }),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      select: (data) => data.payload,
    });

  return { categoryListResponseData, refetchCategoryList };
};
