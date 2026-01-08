
import { useFirebase } from '@/firebase';

export const useAuth = () => {
  const { user, loading, isAdmin, auth } = useFirebase();
  return { user, auth, loading, isAdmin };
};
