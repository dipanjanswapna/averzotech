
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, Query, DocumentData } from 'firebase/firestore';
import { useFirebase } from '../provider';

interface UseCollectionOptions {
  // Add any options you might need in the future, e.g., filters
}

export function useCollection<T>(path: string, options?: UseCollectionOptions) {
  const { db } = useFirebase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    };

    const collectionRef = collection(db, path);
    const q = query(collectionRef); // Here you could add options like where(), orderBy()

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${path}:`, err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, path]);

  return { data, loading, error };
}
