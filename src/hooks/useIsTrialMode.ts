import { useSearchParams } from 'react-router-dom';

const useIsTrialMode = (): boolean => {
  const [searchParams] = useSearchParams();
  const trial = searchParams.get('trial');

  // Return false if trial is not 'true' or if it's missing.
  return trial === 'true';
};
export default useIsTrialMode;
