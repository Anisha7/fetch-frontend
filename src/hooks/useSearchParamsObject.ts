import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

/**
 * Custom hook to extract typed search parameters from the URL.
 * Memoizes the result to avoid unnecessary recalculations.
 */
export const useSearchParamsObject = () => {
  const [searchParams] = useSearchParams();
  return useMemo(() => ({
    breeds: searchParams.getAll("breeds"),
    zipCodes: searchParams.getAll("zipCodes"),
    ageMin: Number(searchParams.get("ageMin")) || undefined,
    ageMax: Number(searchParams.get("ageMax")) || undefined,
  }), [searchParams]);
};