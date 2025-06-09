import { useQuery } from '@tanstack/react-query';

import { getCategoryDirectoryListApi } from '../api/api';

export const useSearchDirInCategory = (
  organId: string,
  currentCategoryIds: string,
) => {
  // 카테고리 소속 디렉토리 검색 query
  const { data: categoryDirectoryList, refetch: refetchCategoryDirectoryList } =
    useQuery({
      queryKey: ['categoryDirectoryList'],
      queryFn: () =>
        getCategoryDirectoryListApi({
          organId: organId ?? '',
          categoryIds: currentCategoryIds,
        }),
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      gcTime: 0,
      select: (data) => data.payload,
    });

  return {
    categoryDirectoryList,
    refetchCategoryDirectoryList,
  };
};
