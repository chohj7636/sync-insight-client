import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postRegisterOrganization } from '../api/api';

const useRegisterOrganQeury = () => {
  const navigate = useNavigate();

  const { mutate: registerOrganization } = useMutation({
    mutationFn: postRegisterOrganization,
    onSuccess: () => {
      toast('회원사 생성 성공', {
        duration: 2000,
        position: 'top-center',
      });
      navigate('/organizations/list');
    },
    onError: () => {
      toast('회원사 생성 실패', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  return { registerOrganization };
};

export default useRegisterOrganQeury;
