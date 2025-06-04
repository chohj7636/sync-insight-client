import { useQuery } from '@tanstack/react-query';

import { getOrganizationDetailApi } from '../api/api';

export const useGetOrganDetailInfo = (organId: string) => {
  // 회원사 상세 조회 query
  const {
    data: organDetailData,
    isLoading: isLoadingOrganDetail,
    refetch: refetchOrganDetail,
  } = useQuery({
    queryKey: ['organDetail', organId],
    queryFn: () => getOrganizationDetailApi({ organId }),
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
    refetchOnMount: false,
  });

  return { organDetailData, isLoadingOrganDetail, refetchOrganDetail };
};
