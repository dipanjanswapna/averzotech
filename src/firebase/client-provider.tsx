
'use client';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

/**
 * Initializes Firebase on the client-side and provides it to all children.
 *
 * This component ensures that Firebase is initialized only once on the client
 * and provides the Firebase app, auth, and firestore instances to its children
 * through the FirebaseProvider.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} A provider that makes Firebase services available to its children.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
