
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { useFirebase } from '../provider';

interface UseDocOptions {
  // Add any options you might need
}

export function useDoc<T>(path: string, id: string, options?: UseDocOptions) {
  const { db } = useFirebase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !id) {
        setLoading(false);
        return;
    };

    const docRef = doc(db, path, id);

    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null); // Document doesn't exist
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching document ${path}/${id}:`, err);
        setError("Failed to fetch document data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, path, id]);

  return { data, loading, error };
}
