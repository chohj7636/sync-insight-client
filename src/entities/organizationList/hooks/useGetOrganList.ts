import { useQuery } from '@tanstack/react-query';

import { getOrganizationsList } from '../api/api';
import { OrganizationsListParams } from '../api/type';

const useGetOrganList = ({
  organParams,
}: {
  organParams: OrganizationsListParams;
}) => {
  const {
    data: organListData,
    refetch: refetchOrganList,
    isLoading: isLoadingOrganList,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => getOrganizationsList(organParams),
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => data.payload,
  });

  return {
    organListData,
    refetchOrganList,
    isLoadingOrganList,
  };
};

export default useGetOrganList;
