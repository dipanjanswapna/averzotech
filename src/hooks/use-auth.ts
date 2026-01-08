import { useFirebase } from '@/firebase';

export const useAuth = () => {
  const { user, loading, isAdmin } = useFirebase();
  return { user, loading, isAdmin };
};
