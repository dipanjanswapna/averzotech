import { useUser } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase';

export const useAuth = () => {
  const { user, loading, isAdmin } = useUser();
  const { auth } = useFirebase();
  return { user, auth, loading, isAdmin };
};
