import { useSearchParams } from 'react-router-dom';

export const useIsTrialMode = (): boolean => {
  const [searchParams] = useSearchParams();
  
  // Log all the search parameters to inspect the query string.
  console.log("Current searchParams:", Array.from(searchParams.entries()));

  const trial = searchParams.get('trial');

  // Debugging log for trial value
  console.log("Trial parameter value:", trial);

  // Return false if trial is not 'true' or if it's missing.
  return trial === 'true';
};
