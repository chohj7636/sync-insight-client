import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postChangeOrganLogoApi } from '../api/api';

interface ChangeOrganInfoProps {
  organId: string;
  refetchOrganDetail: () => void;
}

export const useChangeOrganInfo = ({
  organId,
  refetchOrganDetail,
}: ChangeOrganInfoProps) => {
  // 회원사 로고 변경 query
  const { mutate: changeOrganLogo } = useMutation({
    mutationFn: (file: File) =>
      postChangeOrganLogoApi({
        organId: organId,
        file,
      }),
    onSuccess: () => {
      toast('회원사 로고가 변경되었습니다.', {
        duration: 2000,
        position: 'top-center',
      });
      refetchOrganDetail();
    },
  });

  return { changeOrganLogo };
};

export default useChangeOrganInfo;
