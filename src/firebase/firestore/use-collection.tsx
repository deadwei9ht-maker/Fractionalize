
'use client';

import {
  collection,
  onSnapshot,
  query,
  where,
  type CollectionReference,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';

type UseCollectionOptions = {
  deps?: any[];
  query?: [string, '==', any];
};

export function useCollection<T = DocumentData>(
  collectionName: string,
  options?: UseCollectionOptions
) {
  const db = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const collectionRef = useMemo(
    () => (db ? collection(db, collectionName) : null),
    [db, collectionName]
  );

  const queryRef = useMemo(() => {
    if (!collectionRef) return null;
    if (!options?.query) return collectionRef;
    return query(collectionRef, where(...options.query));
  }, [collectionRef, options?.query]);

  useEffect(() => {
    if (!queryRef) return;

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as T[];
        setData(data);
        setLoading(false);
      },
      (error) => {
        console.error('ERROR', error);
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: (queryRef as CollectionReference).path,
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryRef, ...(options?.deps ?? [])]);

  return { data, loading };
}
