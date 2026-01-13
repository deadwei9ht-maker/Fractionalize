
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';
import { initializeFirebase } from './config';

export interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  db: null,
});

export interface FirebaseProviderProps {
  children: React.ReactNode;
  firebaseConfig: FirebaseOptions;
}

export function FirebaseProvider({
  children,
  firebaseConfig
}: FirebaseProviderProps) {
  const [firebase, setFirebase] = useState<FirebaseContextValue>({
    app: null,
    auth: null,
    db: null,
  });

  useEffect(() => {
    // This effect ensures Firebase is initialized only on the client side.
    if (firebaseConfig?.apiKey) {
      const { app, auth, db } = initializeFirebase(firebaseConfig);
      setFirebase({ app, auth, db });
    }
  }, [firebaseConfig]);

  const value = useMemo(
    () => (firebase),
    [firebase]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().db;
}
