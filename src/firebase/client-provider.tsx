'use client';

import { useMemo } from 'react';

import { FirebaseProvider, type FirebaseProviderProps } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider {...(firebaseApp as FirebaseProviderProps)}>
      {children}
    </FirebaseProvider>
  );
}
