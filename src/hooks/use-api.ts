import { useEffect, useState } from 'react';
import { LoadingState, ApiResponse } from '@/types';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  cacheKey?: string
) {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache if cacheKey is provided
        if (cacheKey) {
          const cached = cache.get(cacheKey);
          if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setState(cached.data);
            setLoading(false);
            return;
          }
        }

        const response = await fetcher();

        if (response.error) {
          throw new Error(response.error);
        }

        setState(response.data);

        // Update cache if cacheKey is provided
        if (cacheKey) {
          cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data: state, loading, error };
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}