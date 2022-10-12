import { useCallback, useEffect, useRef } from 'react';

export const useMounted = (): () => boolean => {
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
};