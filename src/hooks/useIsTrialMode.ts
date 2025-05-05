import { useSearchParams } from 'react-router-dom';

export const useIsTrialMode = (): boolean => {
  const [searchParams] = useSearchParams();
  return searchParams.get('trial') === 'true';
};
