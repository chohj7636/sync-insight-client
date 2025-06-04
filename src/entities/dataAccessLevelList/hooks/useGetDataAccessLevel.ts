import { useQuery } from '@tanstack/react-query';

import { getDataAccessLevelListApi } from '../api/api';

export const useGetDataAccessLevel = (organId: string) => {
  // 데이터 등급 조회 query
  const { data: dataAccessLevelList, refetch: refetchDataAccessLevel } =
    useQuery({
      queryKey: ['dataAccessLevelList', organId],
      queryFn: () => getDataAccessLevelListApi({ organId }),
      gcTime: 0, // 데이터 등급 관련 페이지에서 관련 쿼리들 조작했을때 해당 쿼리 캐시 삭제할 수 있도록 구현하면 좋을듯
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    });

  return { dataAccessLevelList, refetchDataAccessLevel };
};
