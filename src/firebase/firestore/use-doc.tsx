'use client';

import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentReference,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';

export function useDoc<T = DocumentData>(
  collectionName: string,
  docId: string
) {
  const db = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const docRef = useMemo(
    () =>
      db && docId ? (doc(db, collectionName, docId) as DocumentReference) : null,
    [db, collectionName, docId]
  );

  useEffect(() => {
    if (!docRef) return;

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { ...snapshot.data(), id: snapshot.id } as T;
          setData(data);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading };
}
