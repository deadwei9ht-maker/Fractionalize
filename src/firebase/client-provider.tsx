'use client';

import { useMemo } from 'react';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import { firebaseConfig } from './config';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseApp = useMemo(
    () => initializeFirebase(firebaseConfig),
    []
  );

  return (
    <FirebaseProvider
      app={firebaseApp.app}
      auth={firebaseApp.auth}
      db={firebaseApp.db}
    >
      {children}
    </FirebaseProvider>
  );
}
