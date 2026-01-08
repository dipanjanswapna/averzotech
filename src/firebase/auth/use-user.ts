'use client';

import { useFirebase } from '../provider';

export const useUser = () => {
  const { user, loading, isAdmin } = useFirebase();
  return { user, loading, isAdmin };
};
